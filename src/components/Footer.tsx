import Link from "next/link";
import { contact, copy } from "@/content/site";
import type { Lang } from "@/lib/types";
import { logout } from "@/lib/actions";
import CopyEmail from "./CopyEmail";


export default function Footer({ lang, admin }: { lang: Lang; admin: boolean }) {
  const t = copy[lang];
  // Only show the résumé button once the PDF is actually in /public.
  const hasResume = !!(lang === "ko" ? process.env.HAS_RESUME_KO : process.env.HAS_RESUME_EN);
  return (
    <footer id="contact" className="footer">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span className="cta">{t.contact.cta}</span>
        <CopyEmail big email={contact.email} label={t.contact.copy} done={t.contact.copied} />
        <div className="btn-row">
          <CopyEmail email={contact.email} label={t.contact.copy} done={t.contact.copied} />
          <a href={`mailto:${contact.email}`} className="btn btn-ink">{t.contact.mail} →</a>
          {hasResume && <a href={t.contact.resumeHref} download className="btn btn-line">{t.contact.resume} ↓</a>}
          {contact.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-line">{l.label} ↗</a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {t.hero.name} · {t.contact.sign}</span>
        <span style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
          <span>{t.hero.loc}</span>
          {admin ? (
            <form action={logout} style={{ display: "inline" }}>
              <button type="submit" style={{ all: "unset", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>sign out</button>
            </form>
          ) : (
            <Link href="/login" rel="nofollow">sign in</Link>
          )}
        </span>
      </div>
    </footer>
  );
}
