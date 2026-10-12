import "server-only";
import { cookies } from "next/headers";
import type { L, Lang } from "./types";

export const LANG_COOKIE = "nhk_lang";

export async function getLang(): Promise<Lang> {
  const jar = await cookies();
  return jar.get(LANG_COOKIE)?.value === "ko" ? "ko" : "en";
}

/** Pick the requested language, falling back to the other one if it's empty. */
export function pick<T>(v: L<T>, lang: Lang): T {
  const primary = v[lang];
  const other = v[lang === "en" ? "ko" : "en"];
  const empty = (x: unknown) =>
    x == null || (typeof x === "string" && !x.trim()) || (Array.isArray(x) && x.length === 0);
  return empty(primary) ? other : primary;
}
