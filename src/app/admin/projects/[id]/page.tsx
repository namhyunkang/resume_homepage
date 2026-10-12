import { notFound } from "next/navigation";
import NextLink from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { getRawDB } from "@/lib/data";
import ProjectForm from "@/components/ProjectForm";

export const metadata: Metadata = { title: "Edit project", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) notFound();
  const { id } = await params;
  const db = await getRawDB();
  const project = id === "new" ? undefined : db.projects.find((p) => p.id === id);
  if (id !== "new" && !project) notFound();
  return (
    <main className="admin-page" style={{ maxWidth: 1040 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <NextLink href="/admin" className="label">← Dashboard</NextLink>
        <h1>{project ? project.title.en || project.title.ko : "New project"}</h1>
        <p className="muted" style={{ margin: 0 }}>
          Fill in English and Korean. If one side is empty, the page falls back to the other language.
        </p>
      </div>
      <ProjectForm project={project} />
    </main>
  );
}
