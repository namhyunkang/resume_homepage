// Edge-safe session token helpers (Web Crypto only — used by middleware and server code).

export const SESSION_COOKIE = "nhk_session";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

function secret(): string | null {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-secret-change-me-please";
  return null;
}

function b64url(buf: ArrayBuffer): string {
  let s = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(msg: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createToken(): Promise<string | null> {
  const key = secret();
  if (!key) return null;
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const payload = `v1.${exp}`;
  return `${payload}.${await sign(payload, key)}`;
}

export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const key = secret();
  if (!key) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await sign(`${parts[0]}.${parts[1]}`, key);
  return safeEqual(expected, parts[2]);
}

export async function passwordMatches(input: string): Promise<boolean> {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(input)),
    crypto.subtle.digest("SHA-256", enc.encode(real)),
  ]);
  return safeEqual(b64url(a), b64url(b));
}
