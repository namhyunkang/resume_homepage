import type { NextConfig } from "next";
import { existsSync } from "fs";
import path from "path";

// Résumé buttons only render once the PDFs are actually in /public (checked at build time).
const has = (f: string) => (existsSync(path.join(process.cwd(), "public", f)) ? "1" : "");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    HAS_RESUME_EN: has("resume-en.pdf"),
    HAS_RESUME_KO: has("resume-ko.pdf"),
  },
};

export default nextConfig;
