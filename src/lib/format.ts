import type { Lang } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/** Dates are shown in Korea time regardless of the server's timezone. */
function kst(iso: string): Date {
  return new Date(new Date(iso).getTime() + 9 * 3600e3);
}

export function fmtDate(iso: string): string {
  const d = kst(iso);
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`;
}

export function fmtStamp(iso: string): string {
  const d = kst(iso);
  return `${fmtDate(iso)} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export function seqLabel(n: number): string {
  return "#" + String(n).padStart(3, "0");
}

export function ago(iso: string, lang: Lang, now = Date.now()): string {
  const days = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 864e5));
  if (lang === "ko") {
    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 30) return `${days}일 전`;
    return `${Math.floor(days / 30)}개월 전`;
  }
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const m = Math.floor(days / 30);
  return `${m} month${m > 1 ? "s" : ""} ago`;
}

/** Deterministic pseudo-random widths so redaction bars look varied but stable. */
export function redactWidths(id: string, lines: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  const out: number[] = [];
  for (let i = 0; i < lines; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const r = ((h >>> 0) % 1000) / 1000;
    out.push(i === lines - 1 && lines > 1 ? 28 + r * 30 : 62 + r * 34);
  }
  return out;
}
