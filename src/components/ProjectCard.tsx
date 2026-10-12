import { Link } from "next-view-transitions";
import type { Lang, Project } from "@/lib/types";
import { pick } from "@/lib/i18n";
import type { Copy } from "@/content/site";

export default function ProjectCard({ p, i, lang, t, pub, priv }: { p: Project; i: number; lang: Lang; t: Copy; pub: number; priv: number }) {
  return (
    <Link href={`/projects/${p.id}`} id={`card-${p.id}`} className="card">
      <div className="card-top">
        <span className="card-meta" style={{ viewTransitionName: `meta-${p.id}` }}>
          <span className="idx">{String(i + 1).padStart(2, "0")}</span>
          <span>{pick(p.co, lang)} · {p.year}</span>
        </span>
        <span className="badges">
          {pub + priv > 0 && <span className="badge ghost">{t.projects.entries(pub, priv)}</span>}
          {p.caseNotes && <span className="badge">{t.projects.caseBadge}</span>}
        </span>
      </div>
      <h3 style={{ viewTransitionName: `title-${p.id}` }}>{pick(p.title, lang)}</h3>
      <p>{pick(p.summary, lang)}</p>
      <div className="card-foot">
        <div className="tags">
          {p.tags.map((tg) => <span key={tg} className="tag">{tg}</span>)}
        </div>
        <span className="arrow">→</span>
      </div>
    </Link>
  );
}
