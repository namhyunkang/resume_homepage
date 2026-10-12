"use client";

import { useState } from "react";
import { deleteMemo, toggleMemo } from "@/lib/actions";
import MemoComposer from "./MemoComposer";
import ConfirmButton from "./ConfirmButton";

type Full = { id: string; title: string; body: string; visibility: "public" | "private"; projectId: string | null };

/** Admin-only controls. Only ever rendered when the viewer is signed in. */
export default function MemoTools({
  memo,
  projects,
  redirectAfterDelete,
  children,
}: {
  memo: Full;
  projects?: { id: string; title: string }[];
  redirectAfterDelete?: string;
  children: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);
  if (editing)
    return <MemoComposer inline memo={memo} projects={projects} onDone={() => setEditing(false)} />;
  return (
    <>
      {children}
      <div className="entry-tools">
        <button type="button" className="btn btn-sm btn-line" onClick={() => setEditing(true)}>Edit</button>
        <form action={toggleMemo}>
          <input type="hidden" name="id" value={memo.id} />
          <button type="submit" className="btn btn-sm btn-line">
            {memo.visibility === "public" ? "🔒 Make private" : "Make public"}
          </button>
        </form>
        <form action={deleteMemo}>
          <input type="hidden" name="id" value={memo.id} />
          {redirectAfterDelete && <input type="hidden" name="redirect" value={redirectAfterDelete} />}
          <ConfirmButton label="Delete" confirm="Really delete?" />
        </form>
      </div>
    </>
  );
}
