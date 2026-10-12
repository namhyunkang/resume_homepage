import { Link } from "next-view-transitions";
import { copy, marquee } from "@/content/site";
import { getLang, pick } from "@/lib/i18n";
import { getSite } from "@/lib/data";
import { ago, fmtDate, redactWidths, seqLabel } from "@/lib/format";
import ProjectCard from "@/components/ProjectCard";
import SkillPicker from "@/components/SkillPicker";
import LockToast from "@/components/LockToast";
import LockIcon from "@/components/LockIcon";
import Activity from "@/components/Activity";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [lang, { admin, projects, memos }] = await Promise.all([getLang(), getSite()]);
  const t = copy[lang];
  const pubMemos = memos.filter((m) => m.visibility === "public");
  const privMemos = memos.filter((m) => m.visibility === "private");
  const latest = memos[0];
  const titleOf = (id: string | null) => {
    const p = id ? projects.find((x) => x.id === id) : null;
    return p ? pick(p.title, lang) : t.notes.general;
  };
  const NOTE_LIMIT = 8;
  const shown = memos.slice(0, NOTE_LIMIT);

  return (
    <>
      <main className="wrap">
        <section id="top" className="hero">
          {latest && (
            <span className="status"><i />{t.hero.status(ago(latest.createdAt, lang))}</span>
          )}
          <h1 className={lang === "ko" ? "ko" : ""}>{t.hero.name}<span>.</span></h1>
          <div className="hero-grid">
            <div className="hero-meta">
              {t.hero.meta.map((m) => (
                <span key={m.k}>{m.k} — <b>{m.v}</b></span>
              ))}
            </div>
            <p className="lede">{t.hero.lede}</p>
          </div>
        </section>
      </main>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...marquee, ...marquee].map((s, i) => (
            <span key={i}>{s}<em>✳</em></span>
          ))}
        </div>
      </div>

      <main className="wrap">
        <section id="projects" className="section">
          <div className="section-head">
            <h2 className="h2">{t.projects.title}</h2>
            <span className="mono">{t.projects.sub(projects.length)}</span>
          </div>
          <div className="cards">
            {projects.map((p, i) => {
              const own = memos.filter((m) => m.projectId === p.id);
              return (
                <ProjectCard
                  key={p.id}
                  p={p}
                  i={i}
                  lang={lang}
                  t={t}
                  pub={own.filter((m) => m.visibility === "public").length}
                  priv={own.filter((m) => m.visibility === "private").length}
                />
              );
            })}
            {admin && (
              <Link href="/admin/projects/new" className="card-add">
                <span>＋</span>
                {t.projects.add}
              </Link>
            )}
          </div>
        </section>

        <section id="work" className="section work">
          <div className="work-intro">
            <h2 className="h2">{t.work.title}</h2>
            <p>{t.work.body}</p>
          </div>
          <div className="work-rows">
            {t.work.items.map((w) => (
              <div key={w.co} className="work-row">
                <span className="co">{w.co}</span>
                <span className="period">{w.period}</span>
                <span className="role">{w.role}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <div className="section-head">
            <h2 className="h2">{t.skills.title}</h2>
            <span className="mono">{t.skills.hint}</span>
          </div>
          <SkillPicker
            groups={t.skills.groups}
            usedIn={t.skills.usedIn}
            none={t.skills.none}
            projects={projects.map((p) => ({
              id: p.id,
              co: pick(p.co, lang),
              title: pick(p.title, lang),
              text: [p.title.en, p.summary.en, p.tags.join(" "), p.built.en.join(" ")].join(" ").toLowerCase(),
            }))}
          />
        </section>

        <section id="notes" className="section notes-grid">
          <div className="panel">
            <div className="panel-head">
              <span className="panel-title">{t.notes.title}</span>
              <span className="mono">{t.notes.count(pubMemos.length, privMemos.length)}</span>
            </div>
            <p className="panel-sub">{t.notes.sub}</p>
            <LockToast message={t.notes.locked}>
              {shown.map((m) =>
                m.redacted ? (
                  <div key={m.id} className="note-row locked" data-locked role="button" tabIndex={0} title={t.notes.locked}>
                    <span className="seq">{seqLabel(m.seq)}</span>
                    <span className="redact">
                      <LockIcon />
                      <span className="bar" style={{ width: `${redactWidths(m.id, 1)[0] * 0.7}%` }} />
                      <small>{t.notes.words(m.words)}</small>
                    </span>
                    <span className="d">{fmtDate(m.createdAt)}</span>
                  </div>
                ) : (
                  <Link key={m.id} href={m.visibility === "public" ? `/notes/${m.id}` : m.projectId ? `/projects/${m.projectId}#m-${m.id}` : `/admin#m-${m.id}`} className="note-row">
                    <span className="seq">{seqLabel(m.seq)}</span>
                    <span className="t">
                      {m.visibility === "private" && <>🔒 </>}
                      {m.title || "(untitled)"}
                      <small>{titleOf(m.projectId)}</small>
                    </span>
                    <span className="d">{fmtDate(m.createdAt)}</span>
                  </Link>
                )
              )}
              {memos.length === 0 && <div className="note-row"><span /><span className="t muted">{t.notes.empty}</span><span /></div>}
            </LockToast>
            {memos.length > 0 && (
              <Link href="/notes" className="panel-more">
                {lang === "ko" ? `전체 기록 ${memos.length}개 보기 →` : `All ${memos.length} entries →`}
              </Link>
            )}
            <Activity
              memos={memos}
              label={t.notes.activity}
              pubLabel={lang === "ko" ? "공개" : "public"}
              privLabel={lang === "ko" ? "비공개" : "private"}
            />
          </div>
          <div className="panel edu">
            <span className="panel-title" style={{ paddingBottom: 4 }}>{t.edu.title}</span>
            {t.edu.items.map((e) => (
              <div key={e.k} className="edu-item">
                <span className="mono">{e.k}</span>
                <span>{e.v}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
