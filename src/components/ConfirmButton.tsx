"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

/** Two-step destructive button: first click arms it, second click submits. */
export default function ConfirmButton({ label, confirm, className = "" }: { label: string; confirm: string; className?: string }) {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3500);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <button
      type={armed ? "submit" : "button"}
      className={`btn btn-sm btn-danger${armed ? " armed" : ""} ${className}`}
      disabled={pending}
      onClick={(e) => {
        if (!armed) {
          e.preventDefault();
          setArmed(true);
        }
      }}
    >
      {pending ? "…" : armed ? confirm : label}
    </button>
  );
}
