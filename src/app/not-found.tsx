import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap-narrow ppage" style={{ minHeight: "50vh" }}>
      <span className="label">404</span>
      <h1 className="h2">Nothing at this address.</h1>
      <p className="muted" style={{ fontSize: 17, margin: 0 }}>
        Either it moved, or it’s one of the private ones. / 없는 페이지이거나, 비공개 기록입니다.
      </p>
      <Link href="/" className="back-pill" style={{ alignSelf: "flex-start" }}>← Home</Link>
    </main>
  );
}
