"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

type P = { id: string; co: string; title: string; text: string };

export default function SkillPicker({
  groups,
  projects,
  usedIn,
  none,
}: {
  groups: { k: string; v: string[] }[];
  projects: P[];
  usedIn: string;
  none: string;
}) {
  const [pick, setPick] = useState<string | null>(null);

  let hits: P[] = [];
  if (pick) {
    const k = pick.toLowerCase().split(" (")[0].replace(/s$/, "");
    const re = new RegExp("(^|[^a-z0-9+#])" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9+#]|$)");
    hits = k.length > 1 ? projects.filter((p) => re.test(p.text)) : [];
  }

  return (
    <>
      <div className="skill-groups">
        {groups.map((g) => (
          <div key={g.k} className="skill-group">
            <span className="label">{g.k}</span>
            <div className="chips">
              {g.v.map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`chip${pick === name ? " on" : ""}`}
                  aria-pressed={pick === name}
                  onClick={() => setPick(pick === name ? null : name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {pick && (
        <div className="skill-panel" aria-live="polite">
          <span className="mono">{hits.length ? `${usedIn} ${pick}` : `${pick} — ${none}`}</span>
          {hits.map((h) => (
            <Link key={h.id} href={`/projects/${h.id}`}>
              <small>{h.co}</small>
              <span>{h.title} →</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
