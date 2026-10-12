import { Link } from "next-view-transitions";
import type { MemoView } from "@/lib/types";
import { fmtStamp, fmtDate, redactWidths, seqLabel } from "@/lib/format";
import { renderMarkdown } from "@/lib/md";
import LockIcon from "./LockIcon";
import MemoTools from "./MemoTools";

export default function MemoEntry({
  memo,
  admin,
  wordsLabel,
  projects,
  context,
}: {
  memo: MemoView;
  admin: boolean;
  wordsLabel: (n: number) => string;
  projects?: { id: string; title: string }[];
  context?: React.ReactNode;
}) {
  if (memo.redacted) {
    const lines = Math.min(4, Math.max(1, Math.ceil(memo.words / 35)));
    return (
      <div className="entry locked" data-locked role="button" tabIndex={0} aria-label="Private entry">
        <div className="entry-gutter">
          <b>{seqLabel(memo.seq)}</b>
          <span>{fmtDate(memo.createdAt)}</span>
        </div>
        <div className="entry-main">
          <div className="lockline">
            <LockIcon />
            <span className="vis private">private</span>
            <span>{wordsLabel(memo.words)}</span>
            {context}
          </div>
          <div className="redact-lines" aria-hidden="true">
            {redactWidths(memo.id, lines).map((w, i) => (
              <span key={i} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const content = (
    <>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {admin && <span className={`vis ${memo.visibility}`}>{memo.visibility === "private" ? "🔒 private" : "public"}</span>}
        {context}
      </div>
      {memo.title && (
        <div className="entry-title">
          {memo.visibility === "public" ? <Link href={`/notes/${memo.id}`}>{memo.title}</Link> : memo.title}
        </div>
      )}
      {memo.body && <div className="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(memo.body) }} />}
    </>
  );

  return (
    <div className={`entry${memo.visibility === "private" ? " private-own" : ""}`} id={`m-${memo.id}`}>
      <div className="entry-gutter">
        <b>{seqLabel(memo.seq)}</b>
        <span>{fmtStamp(memo.createdAt)}</span>
      </div>
      <div className="entry-main">
        {admin ? (
          <MemoTools
            memo={{ id: memo.id, title: memo.title ?? "", body: memo.body ?? "", visibility: memo.visibility, projectId: memo.projectId }}
            projects={projects}
          >
            {content}
          </MemoTools>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
