import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import type { Metadata } from "next";
import { copy } from "@/content/site";
import { getLang, pick } from "@/lib/i18n";
import { getMemoPage } from "@/lib/data";
import { fmtStamp, seqLabel } from "@/lib/format";
import { renderMarkdown } from "@/lib/md";
import MemoTools from "@/components/MemoTools";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getMemoPage(id);
  if (!data || data.memo.visibility !== "public") return { robots: { index: false } };
  return { title: data.memo.title || "Note" };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const [lang, data] = await Promise.all([getLang(), getMemoPage(id)]);
  if (!data) notFound();
  const { admin, memo, project } = data;
  const t = copy[lang];
  const backHref = project ? `/projects/${project.id}#log` : "/#notes";
  const backLabel = project ? pick(project.title, lang) : t.memo.home;

  const body = (
    <>
      <div className="phead" style={{ gap: 16 }}>
        <span className="meta">
          {seqLabel(memo.seq)} · {fmtStamp(memo.createdAt)}
          {memo.updatedAt !== memo.createdAt && <> · {t.memo.updated} {fmtStamp(memo.updatedAt)}</>}
        </span>
        <h1 style={{ fontSize: "clamp(34px,5vw,52px)" }}>{memo.title || "(untitled)"}</h1>
        {admin && <span className={`vis ${memo.visibility}`}>{memo.visibility === "private" ? "🔒 private — only you can see this page" : "public"}</span>}
      </div>
      <article className="md" style={{ fontSize: 18 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(memo.body ?? "") }} />
    </>
  );

  return (
    <main className="wrap-narrow ppage">
      <div className="ptop">
        <Link href={backHref} className="back-pill"><span style={{ fontSize: 17 }}>←</span>{backLabel}</Link>
      </div>
      {admin ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <MemoTools
            memo={{ id: memo.id, title: memo.title ?? "", body: memo.body ?? "", visibility: memo.visibility, projectId: memo.projectId }}
            redirectAfterDelete={backHref}
          >
            {body}
          </MemoTools>
        </div>
      ) : (
        body
      )}
    </main>
  );
}
