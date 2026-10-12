import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "./session";

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not signed in.");
}
