import "server-only";
import { loadDB } from "./store";
import { isAdmin } from "./auth";
import type { DB, Memo, MemoView, Project } from "./types";

export function countWords(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function sortedProjects(db: DB): Project[] {
  return [...db.projects].sort((a, b) => a.order - b.order);
}

/** The ONLY place memos are turned into something a page can render. */
function toViews(memos: Memo[], admin: boolean): MemoView[] {
  const bySeq = [...memos].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const seq = new Map(bySeq.map((m, i) => [m.id, i + 1]));
  return [...memos]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((m) => {
      const base = {
        id: m.id,
        seq: seq.get(m.id) ?? 0,
        projectId: m.projectId,
        visibility: m.visibility,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        words: countWords(m.title + " " + m.body),
      };
      if (m.visibility === "private" && !admin) return { ...base, redacted: true };
      return { ...base, redacted: false, title: m.title, body: m.body };
    });
}

export async function getSite() {
  const [db, admin] = await Promise.all([loadDB(), isAdmin()]);
  const projects = sortedProjects(db);
  const memos = toViews(db.memos, admin);
  return { admin, projects, memos };
}

export async function getProjectPage(id: string) {
  const { admin, projects, memos } = await getSite();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  return {
    admin,
    project: projects[idx],
    idx,
    total: projects.length,
    prev: projects[(idx - 1 + projects.length) % projects.length],
    next: projects[(idx + 1) % projects.length],
    memos: memos.filter((m) => m.projectId === id),
  };
}

export async function getMemoPage(id: string) {
  const { admin, projects, memos } = await getSite();
  const memo = memos.find((m) => m.id === id);
  if (!memo || memo.redacted) return null;
  const project = memo.projectId ? projects.find((p) => p.id === memo.projectId) ?? null : null;
  return { admin, memo, project };
}

/** Raw access for the admin editor. Callers must check isAdmin() first. */
export async function getRawDB(): Promise<DB> {
  return loadDB();
}
