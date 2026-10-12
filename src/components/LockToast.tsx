"use client";

import { useRef, useState } from "react";

/** Wraps a list; clicking any [data-locked] element inside shows a short message. */
export default function LockToast({ message, children, className }: { message: string; children: React.ReactNode; className?: string }) {
  const [show, setShow] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  return (
    <div
      className={className}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("[data-locked]")) return;
        setShow(true);
        clearTimeout(t.current);
        t.current = setTimeout(() => setShow(false), 2400);
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && (e.target as HTMLElement).closest("[data-locked]")) {
          e.preventDefault();
          (e.target as HTMLElement).click();
        }
      }}
    >
      {children}
      <div aria-live="polite">{show && <div className="toast">🔒 {message}</div>}</div>
    </div>
  );
}
