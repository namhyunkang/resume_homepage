"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createToken, passwordMatches, SESSION_COOKIE, SESSION_DAYS } from "./session";
import { requireAdmin } from "./auth";
import { isLimited, mutate, recordFailure } from "./store";
import { LANG_COOKIE } from "./i18n";
import type { CaseNotes, Memo, Project, Visibility } from "./types";

export type FormState = { error?: string; ok?: boolean } | undefined;

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const lines = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);
const now = () => new Date().toISOString();
const rid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

function done() {
  revalidatePath("/", "layout");
}

/* ── session ─────────────────────────────────────────── */

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  if (!process.env.ADMIN_PASSWORD) return { error: "ADMIN_PASSWORD isn’t set on the server." };
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "local";
  if (await isLimited(ip)) return { error: "Too many attempts. Try again in 15 minutes." };
  const ok = await passwordMatches(s(fd, "password"));
  if (!ok) {
    await recordFailure(ip);
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return { error: "Wrong password." };
  }
  const token = await createToken();
  if (!token) return { error: "Session key unavailable — set ADMIN_PASSWORD." };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  const next = s(fd, "next");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  done();
  redirect("/");
}

export async function setLang(lang: string) {
  const jar = await cookies();
  jar.set(LANG_COOKIE, lang === "ko" ? "ko" : "en", { path: "/", maxAge: 365 * 86400, sameSite: "lax" });
  done();
}

/* ── projects ────────────────────────────────────────── */

export async function saveProject(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const originalId = s(fd, "originalId");
  const id = s(fd, "id").toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(id)) return { error: "Slug: lowercase letters, numbers and dashes (max 40)." };
  const titleEn = s(fd, "title_en");
  const titleKo = s(fd, "title_ko");
  if (!titleEn && !titleKo) return { error: "Give it a title in at least one language." };

  const caseFor = (l: "en" | "ko"): CaseNotes => ({
    symptom: s(fd, `case_symptom_${l}`),
    trace: s(fd, `case_trace_${l}`),
    fix: s(fd, `case_fix_${l}`),
    result: s(fd, `case_result_${l}`),
  });
  const caseEn = caseFor("en");
  const caseKo = caseFor("ko");
  const hasCase = [...Object.values(caseEn), ...Object.values(caseKo)].some(Boolean);

  try {
    await mutate((db) => {
      if (id !== originalId && db.projects.some((p) => p.id === id)) throw new Error(`“${id}” is already taken.`);
      const existing = originalId ? db.projects.find((p) => p.id === originalId) : undefined;
      if (originalId && !existing) throw new Error("That project no longer exists.");
      const t = now();
      const next: Project = {
        id,
        order: existing?.order ?? (db.projects.length ? Math.max(...db.projects.map((p) => p.order)) + 1 : 0),
        co: { en: s(fd, "co_en"), ko: s(fd, "co_ko") },
        year: s(fd, "year"),
        period: { en: s(fd, "period_en"), ko: s(fd, "period_ko") },
        title: { en: titleEn, ko: titleKo },
        summary: { en: s(fd, "summary_en"), ko: s(fd, "summary_ko") },
        tags: s(fd, "tags").split(",").map((x) => x.trim()).filter(Boolean),
        built: { en: lines(s(fd, "built_en")), ko: lines(s(fd, "built_ko")) },
        caseNotes: hasCase ? { en: caseEn, ko: caseKo } : null,
        createdAt: existing?.createdAt ?? t,
        updatedAt: t,
      };
      if (existing) {
        db.projects = db.projects.map((p) => (p.id === originalId ? next : p));
        if (id !== originalId) db.memos.forEach((m) => m.projectId === originalId && (m.projectId = id));
      } else {
        db.projects.push(next);
      }
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  done();
  redirect(`/projects/${id}`);
}

export async function deleteProject(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  await mutate((db) => {
    db.projects = db.projects.filter((p) => p.id !== id);
    // Keep the memos — they become general notes instead of disappearing.
    db.memos.forEach((m) => m.projectId === id && (m.projectId = null));
  });
  done();
  if (s(fd, "from") === "project") redirect("/admin");
}

export async function moveProject(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const dir = s(fd, "dir") === "up" ? -1 : 1;
  await mutate((db) => {
    const list = [...db.projects].sort((a, b) => a.order - b.order);
    const i = list.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    list.forEach((p, k) => (p.order = k));
    db.projects = list;
  });
  done();
}

/* ── memos ───────────────────────────────────────────── */

export async function saveMemo(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = s(fd, "id");
  const title = s(fd, "title");
  const body = String(fd.get("body") ?? "").replace(/\s+$/, "");
  const visibility: Visibility = s(fd, "visibility") === "private" ? "private" : "public";
  const projectId = s(fd, "projectId") || null;
  if (!title && !body) return { error: "Write something first." };
  if (body.length > 50_000) return { error: "That’s a long one — keep it under 50k characters." };
  try {
    await mutate((db) => {
      if (projectId && !db.projects.some((p) => p.id === projectId)) throw new Error("Unknown project.");
      const t = now();
      if (id) {
        const m = db.memos.find((x) => x.id === id);
        if (!m) throw new Error("That memo no longer exists.");
        Object.assign(m, { title, body, visibility, projectId, updatedAt: t });
      } else {
        const memo: Memo = { id: rid(), projectId, visibility, title, body, createdAt: t, updatedAt: t };
        db.memos.push(memo);
      }
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  done();
  return { ok: true };
}

export async function deleteMemo(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  await mutate((db) => {
    db.memos = db.memos.filter((m) => m.id !== id);
  });
  done();
  const to = s(fd, "redirect");
  if (to.startsWith("/") && !to.startsWith("//")) redirect(to);
}

export async function toggleMemo(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  await mutate((db) => {
    const m = db.memos.find((x) => x.id === id);
    if (m) {
      m.visibility = m.visibility === "public" ? "private" : "public";
      m.updatedAt = now();
    }
  });
  done();
}
