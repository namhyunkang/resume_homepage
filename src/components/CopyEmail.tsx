"use client";

import { useRef, useState } from "react";

export default function CopyEmail({ email, label, done, big }: { email: string; label: string; done: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {}
    setCopied(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setCopied(false), 1800);
  };
  if (big)
    return (
      <button type="button" className="big-email" title={label} onClick={copy}>
        {email}
      </button>
    );
  return (
    <button type="button" className={`btn btn-track${copied ? " done" : ""}`} onClick={copy} aria-live="polite">
      {copied ? done : label}
    </button>
  );
}
