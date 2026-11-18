// LOCATION: lib/content-server.ts
// SERVER ONLY. Talks to Supabase using the secret key. Never import this file from a "use client" component.
import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  defaults,
  isSectionKey,
  schemas,
  SECTION_KEYS,
  SECTION_LABELS,
  type Content,
  type SectionKey,
} from "./content-schema";

export const BUCKET = "media";
const TABLE = "site_content";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function supabaseEnv() {
  const url = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const anonKey = (process.env.SUPABASE_ANON_KEY || "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return { url, anonKey, serviceKey, configured: Boolean(url && serviceKey) };
}

export function adminClient(): SupabaseClient | null {
  const { url, serviceKey, configured } = supabaseEnv();
  if (!configured) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // "no-store" = always fetch fresh data, so admin changes show up immediately.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}

type Row = { key: string; value: unknown };

function merge(rows: Row[]): Content {
  const out: Content = { ...defaults };
  for (const row of rows) {
    if (!isSectionKey(row.key)) continue;
    const parsed = schemas[row.key].safeParse(row.value);
    if (parsed.success) (out as Record<string, unknown>)[row.key] = parsed.data;
    else console.error(`[content] Saved "${row.key}" is invalid, using the default instead.`, parsed.error.issues[0]);
  }
  return out;
}

export type Status = { configured: boolean; problem: string };

async function loadRows(db: SupabaseClient): Promise<Row[]> {
  const { data, error } = await db.from(TABLE).select("key,value");
  if (error) throw new Error(error.message);
  return (data ?? []) as Row[];
}

/** Content for the public website. Never throws: on any problem it shows the default content. */
export const getContent = cache(async (): Promise<Content> => {
  const db = adminClient();
  if (!db) return defaults;
  try {
    return merge(await loadRows(db));
  } catch (e) {
    console.error("[content] Could not read from Supabase, showing default content.", e);
    return defaults;
  }
});

/** Content + a plain-English health check, for the admin page. */
export async function getContentWithStatus(): Promise<{ content: Content; status: Status }> {
  const db = adminClient();
  if (!db) {
    return {
      content: defaults,
      status: {
        configured: false,
        problem: "Supabase is not connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to your environment settings.",
      },
    };
  }
  try {
    const rows = await loadRows(db);
    const bucket = await db.storage.getBucket(BUCKET);
    if (bucket.error) {
      return {
        content: merge(rows),
        status: { configured: true, problem: `Storage bucket "${BUCKET}" was not found. Run supabase/setup.sql in the Supabase SQL Editor.` },
      };
    }
    return { content: merge(rows), status: { configured: true, problem: "" } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      content: defaults,
      status: {
        configured: false,
        problem: /site_content|schema cache|does not exist/i.test(msg)
          ? "The database table is missing. Run supabase/setup.sql in the Supabase SQL Editor."
          : `Could not connect to Supabase: ${msg}`,
      },
    };
  }
}

// ---- saving -------------------------------------------------------------------------------

function publicPrefix() {
  return `${supabaseEnv().url}/storage/v1/object/public/${BUCKET}/`;
}

/** Finds every file of ours that is mentioned anywhere inside a value. */
function collectPaths(value: unknown, out: Set<string>) {
  const prefix = publicPrefix();
  if (typeof value === "string") {
    if (value.startsWith(prefix)) {
      try {
        out.add(decodeURIComponent(value.slice(prefix.length).split("?")[0]));
      } catch {
        /* ignore odd links */
      }
    }
  } else if (Array.isArray(value)) value.forEach((v) => collectPaths(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => collectPaths(v, out));
}

export async function saveSections(input: Record<string, unknown>): Promise<Partial<Content>> {
  const db = adminClient();
  if (!db) throw new HttpError(503, "Supabase is not connected yet, so changes cannot be saved. Finish the Supabase setup first.");

  const parsed: Partial<Record<SectionKey, unknown>> = {};
  const problems: string[] = [];
  for (const [key, raw] of Object.entries(input)) {
    if (!isSectionKey(key)) {
      problems.push(`Unknown section "${key}"`);
      continue;
    }
    const result = schemas[key].safeParse(raw);
    if (!result.success) {
      const first = result.error.issues
        .slice(0, 3)
        .map((i) => {
          const where = i.path.length ? `${i.path.map((p) => (typeof p === "number" ? `#${p + 1}` : p)).join(" › ")}: ` : "";
          return where + i.message;
        })
        .join("; ");
      problems.push(`${SECTION_LABELS[key]} → ${first}`);
    } else parsed[key] = result.data;
  }
  if (problems.length) throw new HttpError(400, problems.join("  |  "));
  const keys = Object.keys(parsed) as SectionKey[];
  if (!keys.length) return {};

  // Remember what was saved before, so files nobody uses any more can be cleaned up afterwards.
  const before = await db.from(TABLE).select("key,value").in("key", keys);
  if (before.error) throw new HttpError(500, `Could not read the database: ${before.error.message}`);

  const now = new Date().toISOString();
  const up = await db.from(TABLE).upsert(keys.map((key) => ({ key, value: parsed[key], updated_at: now })), { onConflict: "key" });
  if (up.error) throw new HttpError(500, `Could not save: ${up.error.message}`);

  // Delete files that were removed AND are not used anywhere else on the website.
  try {
    const old = new Set<string>();
    (before.data ?? []).forEach((r: Row) => collectPaths(r.value, old));
    if (old.size) {
      const stillUsed = new Set<string>();
      (await loadRows(db)).forEach((r) => collectPaths(r.value, stillUsed));
      const unused = [...old].filter((p) => !stillUsed.has(p));
      if (unused.length) await db.storage.from(BUCKET).remove(unused);
    }
  } catch (e) {
    console.error("[content] Clean-up of old files failed (your changes ARE saved).", e);
  }
  return parsed as Partial<Content>;
}

export { SECTION_KEYS };