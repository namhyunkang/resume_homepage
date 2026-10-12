"use client";

import { useActionState } from "react";
import NextLink from "next/link";
import { saveProject, type FormState } from "@/lib/actions";
import type { Project } from "@/lib/types";
import SubmitButton from "./SubmitButton";

const empty: Project = {
  id: "",
  order: 0,
  co: { en: "", ko: "" },
  year: "",
  period: { en: "", ko: "" },
  title: { en: "", ko: "" },
  summary: { en: "", ko: "" },
  tags: [],
  built: { en: [], ko: [] },
  caseNotes: null,
  createdAt: "",
  updatedAt: "",
};

function Pair({ label, name, p, hint, area, rows = 3 }: { label: string; name: string; p: Record<"en" | "ko", string>; hint?: string; area?: boolean; rows?: number }) {
  return (
    <>
      {(["en", "ko"] as const).map((l) => (
        <label key={l} className="field">
          <span>
            {label}
            <em className="lang-tag">{l.toUpperCase()}</em>
            {hint && l === "en" && <small> · {hint}</small>}
          </span>
          {area ? (
            <textarea className="textarea" name={`${name}_${l}`} rows={rows} defaultValue={p[l]} />
          ) : (
            <input className="input" name={`${name}_${l}`} defaultValue={p[l]} />
          )}
        </label>
      ))}
    </>
  );
}

export default function ProjectForm({ project }: { project?: Project }) {
  const p = project ?? empty;
  const [state, action] = useActionState<FormState, FormData>(saveProject, undefined);
  const cn = p.caseNotes ?? {
    en: { symptom: "", trace: "", fix: "", result: "" },
    ko: { symptom: "", trace: "", fix: "", result: "" },
  };
  const pickCase = (k: keyof typeof cn.en) => ({ en: cn.en[k], ko: cn.ko[k] });

  return (
    <form action={action} className="pform">
      <input type="hidden" name="originalId" value={project?.id ?? ""} />

      <div className="fieldset">
        <span className="label">Basics</span>
        <div className="pform-grid">
          <label className="field">
            <span>Slug <small>· URL: /projects/slug</small></span>
            <input className="input mono" name="id" defaultValue={p.id} required pattern="[a-z0-9][a-z0-9\-]{0,39}" placeholder="my-project" />
          </label>
          <label className="field">
            <span>Year (card) <small>· e.g. 2024– or 2021–23</small></span>
            <input className="input" name="year" defaultValue={p.year} />
          </label>
          <Pair label="Title" name="title" p={p.title} />
          <Pair label="Company" name="co" p={p.co} />
          <Pair label="Period" name="period" p={p.period} hint="Aug 2024 — Present" />
          <label className="field full">
            <span>Tags <small>· comma-separated — also used by the skill finder</small></span>
            <input className="input" name="tags" defaultValue={p.tags.join(", ")} placeholder="C++, I2C, RTOS" />
          </label>
        </div>
      </div>

      <div className="fieldset">
        <span className="label">Card & page text</span>
        <div className="pform-grid">
          <Pair label="One-line summary" name="summary" p={p.summary} area rows={2} />
          <Pair label="What I built" name="built" p={{ en: p.built.en.join("\n"), ko: p.built.ko.join("\n") }} hint="one bullet per line" area rows={6} />
        </div>
      </div>

      <div className="fieldset">
        <span className="label">Case notes <small className="hint" style={{ textTransform: "none" }}>· optional — leave all empty to hide</small></span>
        <div className="pform-grid">
          <Pair label="Symptom" name="case_symptom" p={pickCase("symptom")} area rows={2} />
          <Pair label="Trace" name="case_trace" p={pickCase("trace")} area rows={4} />
          <Pair label="Fix" name="case_fix" p={pickCase("fix")} area rows={3} />
          <Pair label="Result" name="case_result" p={pickCase("result")} area rows={2} />
        </div>
      </div>

      <div className="sticky-save">
        {state?.error && <span className="error" style={{ marginRight: "auto" }}>{state.error}</span>}
        <NextLink href={project ? `/projects/${project.id}` : "/admin"} className="btn btn-sm btn-line">Cancel</NextLink>
        <SubmitButton className="btn btn-sm btn-ink">{project ? "Save changes" : "Create project"}</SubmitButton>
      </div>
    </form>
  );
}
