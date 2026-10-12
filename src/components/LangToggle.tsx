"use client";

import { useTransition } from "react";
import { setLang } from "@/lib/actions";
import type { Lang } from "@/lib/types";

export default function LangToggle({ lang }: { lang: Lang }) {
  const [pending, start] = useTransition();
  const go = (l: Lang) => {
    if (l === lang) return;
    document.documentElement.lang = l;
    start(() => setLang(l));
  };
  return (
    <div className="seg" role="group" aria-label="Language" style={{ opacity: pending ? 0.6 : 1 }}>
      <button type="button" className={lang === "ko" ? "on" : ""} aria-pressed={lang === "ko"} onClick={() => go("ko")}>KO</button>
      <button type="button" className={lang === "en" ? "on" : ""} aria-pressed={lang === "en"} onClick={() => go("en")}>EN</button>
    </div>
  );
}
