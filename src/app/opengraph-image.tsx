import { ImageResponse } from "next/og";

export const alt = "Nam Hyun Kang — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#F3F2EC", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, color: "#66645B" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#9CC21A" }} />
          namhyunkang.vercel.app
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 800, letterSpacing: -6, color: "#16160F", lineHeight: 1 }}>
            Nam Hyun Kang<span style={{ color: "#9CC21A" }}>.</span>
          </div>
          <div style={{ fontSize: 38, color: "#2B2A25", maxWidth: 960, lineHeight: 1.35 }}>
            Sensor firmware · Linux/Android device software · Equipment monitoring
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["C/C++", "Java", "Linux", "Android", "RTOS", "I2C"].map((t) => (
            <div key={t} style={{ fontSize: 26, padding: "8px 18px", borderRadius: 10, background: "#E6E4DC", color: "#16160F" }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
