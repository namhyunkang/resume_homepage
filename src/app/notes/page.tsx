import { Link } from "next-view-transitions";
import type { Metadata } from "next";
import { copy } from "@/content/site";
import { getLang, pick } from "@/lib/i18n";
import { getSite } from "@/lib/data";
import MemoEntry from "@/components/MemoEntry";
import LockToast from "@/components/LockToast";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notebook" };

export default async function NotesIndex() {
  const [lang, { admin, projects, memos }] = await Promise.all([getLang(), getSite()]);
  const t = copy[lang];
  const pub = memos.filter((m) => m.visibility === "public").length;
  const opts = projects.map((p) => ({ id: p.id, title: pick(p.title, lang) }));
  const ctx = (id: string | null) => {
    const p = projects.find((x) => x.id === id);
    return p ? (
      <Link href={`/projects/${p.id}`} className="mono muted" style={{ fontSize: 11.5 }}>↳ {pick(p.title, lang)}</Link>
    ) : (
      <span className="mono muted" style={{ fontSize: 11.5 }}>↳ {t.notes.general}</span>
    );
  };
  return (
    <main className="wrap-narrow ppage">
      <div className="ptop">
        <Link href="/#notes" className="back-pill"><span style={{ fontSize: 17 }}>←</span>Home</Link>
      </div>
      <div className="phead">
        <span className="meta">{t.notes.count(pub, memos.length - pub)}</span>
        <h1>{t.notes.title}</h1>
        <p className="muted" style={{ margin: 0, fontSize: 17, lineHeight: 1.6 }}>{t.notes.sub}</p>
      </div>
      <section className="log">
        <div className="log-head">
          <strong>{t.project.log}</strong>
          <span className="mono">{memos.length}</span>
        </div>
        <LockToast message={t.notes.locked}>
          {memos.map((m) => (
            <MemoEntry key={m.id} memo={m} admin={admin} projects={admin ? opts : undefined} wordsLabel={t.notes.words} context={ctx(m.projectId)} />
          ))}
          {memos.length === 0 && <div className="log-empty">{t.notes.empty}</div>}
        </LockToast>
      </section>
    </main>
  );
}
