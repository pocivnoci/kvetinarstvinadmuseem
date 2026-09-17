/**
 * Přístup k databázi — jen ze serveru.
 *
 * Volá se tajným klíčem projektu, který smí obcházet pravidla RLS.
 * Ten klíč nesmí nikdy do prohlížeče, proto tenhle soubor importují
 * výhradně API routy (běží na serveru), nikdy komponenta.
 *
 * Bez knihovny: Supabase má běžné HTTP API a dvě volání se dají napsat
 * jedním fetchem. Míň závislostí, míň věcí k udržování.
 */

const URL_ENV = "SUPABASE_URL";
const KEY_ENV = "SUPABASE_SECRET_KEY";

function config(): { url: string; key: string } | null {
  const url = process.env[URL_ENV]?.replace(/\/$/, "");
  const key = process.env[KEY_ENV];
  return url && key ? { url, key } : null;
}

/** Je databáze nastavená? Když ne, admin běží v režimu „jen tenhle prohlížeč". */
export function isDbConfigured(): boolean {
  return config() !== null;
}

async function rpc<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const c = config();
  if (!c) throw new Error("Databáze není nastavená.");

  const res = await fetch(`${c.url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: c.key,
      Authorization: `Bearer ${c.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${name} selhalo (${res.status}): ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

/** Celý dokument adminu i s číslem revize. */
export function loadDoc(): Promise<Record<string, unknown>> {
  return rpc("load_admin_doc", {});
}

export type SaveResult = { ok: boolean; conflict?: boolean; revision: number };

/**
 * Uloží celý dokument. `expectedRevision` je revize, ze které admin
 * vycházel — když se mezitím změnila, databáze nic nepřepíše a vrátí
 * conflict.
 */
export function saveDoc(doc: unknown, expectedRevision: number | null): Promise<SaveResult> {
  return rpc("save_admin_doc", { doc, expected_revision: expectedRevision });
}
