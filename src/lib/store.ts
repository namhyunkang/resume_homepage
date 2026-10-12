import "server-only";
import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";
import type { DB } from "./types";
import { seedDB } from "@/content/seed";

const KEY = "nhk:db:v1";
const FILE = path.join(process.cwd(), ".data", "db.json");

function redis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return new Redis({ url, token });
  return null;
}

export type StorageKind = "redis" | "file" | "none";

export function storageKind(): StorageKind {
  if (redis()) return "redis";
  // Vercel's filesystem is read-only at runtime, so the file fallback is local-only.
  if (process.env.VERCEL) return "none";
  return "file";
}

function fresh(): DB {
  return structuredClone(seedDB);
}

export async function loadDB(): Promise<DB> {
  const r = redis();
  if (r) {
    const data = await r.get<DB>(KEY);
    return data ?? fresh();
  }
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as DB;
  } catch {
    return fresh();
  }
}

export async function saveDB(db: DB): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(KEY, db);
    return;
  }
  if (process.env.VERCEL) {
    throw new Error(
      "Storage isn't configured. Connect Upstash Redis in Vercel (KV_REST_API_URL / KV_REST_API_TOKEN) and redeploy."
    );
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(db, null, 2), "utf8");
}

/** Read–modify–write helper. Single admin, so last write wins is fine. */
export async function mutate(fn: (db: DB) => void | Promise<void>): Promise<DB> {
  const db = await loadDB();
  await fn(db);
  await saveDB(db);
  return db;
}

/* ── login rate limit ─────────────────────────────────── */

const memHits = new Map<string, { n: number; until: number }>();

/** Returns true when `key` has failed more than `max` times inside the window. */
export async function isLimited(key: string, max = 8): Promise<boolean> {
  const r = redis();
  if (r) {
    const n = Number((await r.get<number>(`nhk:rl:${key}`)) ?? 0);
    return n >= max;
  }
  const e = memHits.get(key);
  return !!e && e.until > Date.now() && e.n >= max;
}

export async function recordFailure(key: string, windowSec = 900): Promise<void> {
  const r = redis();
  if (r) {
    const k = `nhk:rl:${key}`;
    const n = await r.incr(k);
    if (n === 1) await r.expire(k, windowSec);
    return;
  }
  const e = memHits.get(key);
  if (!e || e.until < Date.now()) memHits.set(key, { n: 1, until: Date.now() + windowSec * 1000 });
  else e.n++;
}
