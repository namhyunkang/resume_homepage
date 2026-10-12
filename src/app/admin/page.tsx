import NextLink from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { getSite } from "@/lib/data";
import { storageKind } from "@/lib/store";
import { deleteProject, logout, moveProject } from "@/lib/actions";
import { copy } from "@/content/site";
import MemoComposer from "@/components/MemoComposer";
import MemoEntry from "@/components/MemoEntry";
import ConfirmButton from "@/components/ConfirmButton";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAdmin())) notFound();
  const { projects, memos } = await getSite(); // admin → private memos unredacted
  const storage = storageKind();
  const opts = projects.map((p) => ({ id: p.id, title: p.title.en || p.title.ko }));
  const titleOf = (id: string | null) => opts.find((o) => o.id === id)?.title ?? "General";
  const priv = memos.filter((m) => m.visibility === "private").length;

  return (
    <main className="admin-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span className="label">nhk · admin</span>
          <h1>Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="mono muted" style={{ fontSize: 12 }}>
            storage: {storage === "redis" ? "Upstash Redis ✓" : storage === "file" ? "local file (.data/db.json)" : "not configured"}
          </span>
          <NextLink href="/" className="btn btn-sm btn-line">View site</NextLink>
          <form action={logout}><button className="btn btn-sm btn-line" type="submit">Sign out</button></form>
        </div>
      </div>

      {storage === "none" && (
        <div className="warn">
          ⚠ Storage isn’t connected, so edits can’t be saved. In Vercel: Storage → connect Upstash Redis to this project
          (it adds KV_REST_API_URL / KV_REST_API_TOKEN), then redeploy.
        </div>
      )}

      <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="section-head" style={{ paddingBottom: 0 }}>
          <h2 className="h2" style={{ fontSize: 36 }}>Projects</h2>
          <NextLink href="/admin/projects/new" className="btn btn-sm btn-ink">＋ New project</NextLink>
        </div>
        <div className="table">
          {projects.map((p, i) => {
            const n = memos.filter((m) => m.projectId === p.id).length;
            return (
              <div key={p.id} className="trow">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="name">
                  <b>{p.title.en || p.title.ko}</b>
                  <small>/{p.id} · {p.co.en} · {n} memo{n === 1 ? "" : "s"}{p.caseNotes ? " · case notes" : ""}</small>
                </span>
                <span className="acts">
                  <form action={moveProject}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="dir" value="up" />
                    <button className="icon-btn" type="submit" disabled={i === 0} aria-label="Move up">↑</button>
                  </form>
                  <form action={moveProject}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="dir" value="down" />
                    <button className="icon-btn" type="submit" disabled={i === projects.length - 1} aria-label="Move down">↓</button>
                  </form>
                  <NextLink href={`/projects/${p.id}`} className="btn btn-sm btn-line">Open</NextLink>
                  <NextLink href={`/admin/projects/${p.id}`} className="btn btn-sm btn-line">Edit</NextLink>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmButton label="Delete" confirm="Sure?" />
                  </form>
                </span>
              </div>
            );
          })}
          {projects.length === 0 && <div className="trow"><span /><span className="muted">No projects yet.</span><span /></div>}
        </div>
        <span className="hint">Deleting a project keeps its memos — they become general notes.</span>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="section-head" style={{ paddingBottom: 0 }}>
          <h2 className="h2" style={{ fontSize: 36 }}>Notebook</h2>
          <span className="mono muted" style={{ fontSize: 12.5 }}>{memos.length - priv} public · {priv} private</span>
        </div>
        <div className="log">
          <div className="log-head">
            <strong>New entry</strong>
            <span className="mono">attach to a project, or leave it general</span>
          </div>
          <MemoComposer projects={opts} />
          {memos.map((m) => (
            <MemoEntry
              key={m.id}
              memo={m}
              admin
              projects={opts}
              wordsLabel={copy.en.notes.words}
              context={<span className="mono muted" style={{ fontSize: 11.5 }}>{titleOf(m.projectId)}</span>}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
