"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveMemo, type FormState } from "@/lib/actions";
import SubmitButton from "./SubmitButton";

type Opt = { id: string; title: string };
type Existing = { id: string; title: string; body: string; visibility: "public" | "private"; projectId: string | null };

export default function MemoComposer({
  projectId = null,
  projects,
  memo,
  onDone,
  inline,
  placeholder = "What happened, what you checked, what you’d do differently…",
}: {
  projectId?: string | null;
  projects?: Opt[];
  memo?: Existing;
  onDone?: () => void;
  inline?: boolean;
  placeholder?: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(saveMemo, undefined);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      if (!memo) form.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const vis = memo?.visibility ?? "public";
  const pid = memo ? memo.projectId : projectId;

  return (
    <form ref={form} action={action} className={`composer${inline ? " inline" : ""}`}>
      {memo && <input type="hidden" name="id" value={memo.id} />}
      {!projects && <input type="hidden" name="projectId" value={pid ?? ""} />}
      <input className="input title-in" name="title" placeholder="Title" defaultValue={memo?.title} maxLength={200} />
      <textarea
        className="textarea mono-in"
        name="body"
        rows={memo ? 8 : 4}
        placeholder={placeholder}
        defaultValue={memo?.body}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            form.current?.requestSubmit();
          }
        }}
      />
      <div className="composer-row">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div className="vis-toggle" role="radiogroup" aria-label="Visibility">
            <label>
              <input type="radio" name="visibility" value="public" defaultChecked={vis === "public"} />
              Public
            </label>
            <label>
              <input type="radio" name="visibility" value="private" defaultChecked={vis === "private"} />
              🔒 Private
            </label>
          </div>
          {projects && (
            <select className="select" name="projectId" defaultValue={pid ?? ""} style={{ width: "auto", padding: "7px 10px", fontSize: 13.5 }}>
              <option value="">— General note —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="hint">markdown · ⌘/Ctrl+Enter to save</span>
          {onDone && memo && (
            <button type="button" className="btn btn-sm btn-line" onClick={onDone}>Cancel</button>
          )}
          <SubmitButton className="btn btn-sm btn-ink">{memo ? "Save" : "Add entry"}</SubmitButton>
        </div>
      </div>
      {state?.error && <div className="error">{state.error}</div>}
    </form>
  );
}
