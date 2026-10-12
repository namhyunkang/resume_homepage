import type { Metadata, Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLang } from "@/lib/i18n";
import { isAdmin } from "@/lib/auth";
import "./globals.css";

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    title: "Nam Hyun Kang · Software Engineer",
    description: "Sensor firmware, Linux/Android device software, equipment monitoring — plus a working notebook.",
  },
  title: { default: "Nam Hyun Kang · Software Engineer", template: "%s · Nam Hyun Kang" },
  description: "Software engineer — sensor firmware, Linux/Android device software, equipment monitoring. Projects and a working notebook.",
};

export const viewport: Viewport = { themeColor: "#F3F2EC" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, admin] = await Promise.all([getLang(), isAdmin()]);
  return (
    <ViewTransitions>
      <html lang={lang}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/static/woff2/SUIT.css" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
        </head>
        <body>
          <Header lang={lang} admin={admin} />
          {children}
          <Footer lang={lang} admin={admin} />
        </body>
      </html>
    </ViewTransitions>
  );
}
