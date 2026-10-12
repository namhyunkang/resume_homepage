import "server-only";
import { cookies, headers } from "next/headers";
import type { L, Lang } from "./types";

export const LANG_COOKIE = "nhk_lang";

export async function getLang(): Promise<Lang> {
  const jar = await cookies();
  const saved = jar.get(LANG_COOKIE)?.value;
  if (saved === "ko" || saved === "en") return saved;
  // First visit: follow the browser — Korean browsers get Korean.
  const al = (await headers()).get("accept-language") ?? "";
  return /^\s*ko\b/i.test(al) ? "ko" : "en";
}

/** Pick the requested language, falling back to the other one if it's empty. */
export function pick<T>(v: L<T>, lang: Lang): T {
  const primary = v[lang];
  const other = v[lang === "en" ? "ko" : "en"];
  const empty = (x: unknown) =>
    x == null || (typeof x === "string" && !x.trim()) || (Array.isArray(x) && x.length === 0);
  return empty(primary) ? other : primary;
}
