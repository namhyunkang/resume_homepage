"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/lib/actions";
import SubmitButton from "./SubmitButton";

export default function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState<FormState, FormData>(login, undefined);
  return (
    <form action={action} className="login">
      <span className="label">nhk · admin</span>
      <h1>Sign in</h1>
      <p>Owner only. Visitors can read everything public — and see that the private notes exist.</p>
      <input type="hidden" name="next" value={next} />
      <label className="field">
        <span>Password</span>
        <input className="input" type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      {state?.error && <div className="error">{state.error}</div>}
      <SubmitButton className="btn btn-ink" pendingText="Checking…">Sign in →</SubmitButton>
    </form>
  );
}
