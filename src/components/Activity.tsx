import type { MemoView } from "@/lib/types";

/** 26-week strip of logging activity. Counts private entries too (dates only). */
export default function Activity({ memos, label, pubLabel, privLabel }: { memos: MemoView[]; label: string; pubLabel: string; privLabel: string }) {
  const WEEKS = 26;
  const now = Date.now();
  const cells = Array.from({ length: WEEKS }, () => ({ pub: 0, priv: 0 }));
  for (const m of memos) {
    const w = Math.floor((now - new Date(m.createdAt).getTime()) / (7 * 864e5));
    if (w < 0 || w >= WEEKS) continue;
    const c = cells[WEEKS - 1 - w];
    m.visibility === "private" ? c.priv++ : c.pub++;
  }
  return (
    <div className="activity" aria-hidden="true">
      <div className="activity-cells">
        {cells.map((c, i) => {
          const n = c.pub + c.priv;
          const lvl = n === 0 ? "" : n === 1 ? "l1" : n === 2 ? "l2" : "l3";
          const onlyPriv = n > 0 && c.pub === 0;
          return <i key={i} className={`${lvl}${onlyPriv ? " p" : ""}`} />;
        })}
      </div>
      <div className="activity-legend">
        <span>{label}</span>
        <span>
          <span><i style={{ background: "var(--lime)" }} /> {pubLabel}</span>
          <span style={{ marginLeft: 10 }}><i style={{ background: "repeating-linear-gradient(135deg,var(--card) 0 2px,var(--soft) 2px 4px)" }} /> {privLabel}</span>
        </span>
      </div>
    </div>
  );
}
