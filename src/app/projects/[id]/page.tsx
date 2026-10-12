import { notFound } from "next/navigation";
import NextLink from "next/link";
import { Link } from "next-view-transitions";
import type { Metadata } from "next";
import { copy } from "@/content/site";
import { getLang, pick } from "@/lib/i18n";
import { getProjectPage } from "@/lib/data";
import { deleteProject } from "@/lib/actions";
import MemoEntry from "@/components/MemoEntry";
import MemoComposer from "@/components/MemoComposer";
import LockToast from "@/components/LockToast";
import ConfirmButton from "@/components/ConfirmButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [lang, data] = await Promise.all([getLang(), getProjectPage(id)]);
  if (!data) return {};
  return { title: pick(data.project.title, lang), description: pick(data.project.summary, lang) };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const [lang, data] = await Promise.all([getLang(), getProjectPage(id)]);
  if (!data) notFound();
  const { admin, project: p, idx, total, prev, next, memos } = data;
  const t = copy[lang];
  const tp = t.project;
  const cn = p.caseNotes ? pick(p.caseNotes, lang) : null;
  const caseRows = cn ? [cn.symptom, cn.trace, cn.fix, cn.result] : [];
  const pub = memos.filter((m) => m.visibility === "public").length;
  const priv = memos.length - pub;
  const pos = (n: number) => String(n).padStart(2, "0");

  return (
    <main className="wrap-narrow ppage">
      {admin && (
        <div className="adminbar">
          <span>● admin · {p.id}</span>
          <div className="btns">
            <NextLink href={`/admin/projects/${p.id}`} className="btn btn-sm btn-lime">Edit project</NextLink>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="from" value="project" />
              <ConfirmButton label="Delete" confirm="Delete project? (memos are kept)" />
            </form>
          </div>
        </div>
      )}

      <div className="ptop">
        <Link href={`/#card-${p.id}`} className="back-pill"><span style={{ fontSize: 17 }}>←</span>{tp.back}</Link>
        <div className="pnav">
          <span className="pos">{pos(idx + 1)} / {pos(total)}</span>
          <Link href={`/projects/${prev.id}`} className="round" title={tp.prev} aria-label={tp.prev}>←</Link>
          <Link href={`/projects/${next.id}`} className="round" title={tp.next} aria-label={tp.next}>→</Link>
        </div>
      </div>

      <div className="phead">
        <span className="meta" style={{ viewTransitionName: `meta-${p.id}` }}>{pick(p.co, lang)} · {pick(p.period, lang)}</span>
        <h1 style={{ viewTransitionName: `title-${p.id}` }}>{pick(p.title, lang)}</h1>
        <div className="pill-tags">{p.tags.map((tg) => <span key={tg}>{tg}</span>)}</div>
      </div>

      {pick(p.built, lang).length > 0 && (
        <section className="built">
          <span className="label">{tp.built}</span>
          <ul>{pick(p.built, lang).map((b, i) => <li key={i}>{b}</li>)}</ul>
        </section>
      )}

      {cn ? (
        <section className="case">
          <div className="case-head">
            <strong>{tp.caseTitle}</strong>
            <span>{tp.caseSub}</span>
          </div>
          {caseRows.map((v, i) =>
            v ? (
              <div key={i} className="case-row">
                <span className={`label${i === 3 ? " out" : ""}`}>{tp.caseLabels[i]}</span>
                <p>{v}</p>
              </div>
            ) : null
          )}
        </section>
      ) : (
        <div className="dashed-box">{tp.noCase}</div>
      )}

      <section className="log" id="log">
        <div className="log-head">
          <strong>{tp.log}</strong>
          <span className="mono">{tp.logCount(pub, priv)}</span>
        </div>
        {admin && <MemoComposer projectId={p.id} />}
        <LockToast message={t.notes.locked}>
          {memos.map((m) => (
            <MemoEntry key={m.id} memo={m} admin={admin} wordsLabel={t.notes.words} />
          ))}
          {memos.length === 0 && <div className="log-empty">{tp.logEmpty}</div>}
        </LockToast>
      </section>

      <div className="pfoot">
        <Link href={`/projects/${prev.id}`} className="prev">
          <span className="mono">← {tp.prev}</span>
          <b>{pick(prev.title, lang)}</b>
        </Link>
        <Link href={`/projects/${next.id}`} className="next">
          <span className="mono">{tp.next} →</span>
          <b>{pick(next.title, lang)}</b>
        </Link>
      </div>
      <Link href={`/#card-${p.id}`} className="under">{tp.back}</Link>
    </main>
  );
}
