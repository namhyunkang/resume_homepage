"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavPills({ items }: { items: { id: string; label: string }[] }) {
  const path = usePathname();
  const home = path === "/";
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (!home) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [home, items]);

  return (
    <nav className="nav" aria-label="Sections">
      {items.map((i) => (
        <a key={i.id} href={home ? `#${i.id}` : `/#${i.id}`} className={home && active === i.id ? "on" : ""}>
          {i.label}
        </a>
      ))}
    </nav>
  );
}
