"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap-narrow ppage" style={{ minHeight: "50vh" }}>
      <span className="label">error</span>
      <h1 className="h2">Something tripped.</h1>
      <p className="muted" style={{ fontSize: 16, margin: 0, lineHeight: 1.6 }}>
        {error.message?.includes("Storage") ? error.message : "That didn’t go through. Try once more — if it keeps happening, check the server logs."}
      </p>
      <button type="button" className="btn btn-ink" style={{ alignSelf: "flex-start" }} onClick={reset}>Try again</button>
    </main>
  );
}
