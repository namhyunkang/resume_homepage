import Link from "next/link";
import { copy } from "@/content/site";
import type { Lang } from "@/lib/types";
import NavPills from "./NavPills";
import LangToggle from "./LangToggle";

export default function Header({ lang, admin }: { lang: Lang; admin: boolean }) {
  const t = copy[lang];
  return (
    <header className="site-header">
      <div className="inner">
        <Link href="/" className="logo">nhk<i /></Link>
        <NavPills items={t.nav} />
        <div className="header-right">
          {admin && <Link href="/admin" className="admin-chip" title="Signed in">admin</Link>}
          <LangToggle lang={lang} />
        </div>
      </div>
    </header>
  );
}
