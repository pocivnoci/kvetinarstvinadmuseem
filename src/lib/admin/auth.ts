/**
 * Přihlášení do adminu — jedno sdílené heslo z proměnné ADMIN_PASSWORD.
 *
 * Po ověření hesla dostane prohlížeč HttpOnly cookie s HMAC podpisem
 * odvozeným z hesla. Middleware podpis ověří u každé návštěvy /admin.
 * Změna hesla tedy automaticky odhlásí všechna zařízení.
 *
 * Používá jen Web Crypto, aby to běželo i v edge middleware.
 */

export const ADMIN_COOKIE = "knm_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dní

const TOKEN_PAYLOAD = "knm-admin-v1";

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
}

/** Konstantní čas porovnání — ať délka shody neprozradí nic o hesle. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function adminPassword(): string | undefined {
  const v = process.env.ADMIN_PASSWORD;
  return v && v.length > 0 ? v : undefined;
}

/** Hodnota cookie pro dané heslo. */
export async function sessionToken(password: string): Promise<string> {
  return hmac(password, TOKEN_PAYLOAD);
}

/** Je cookie platná pro aktuálně nastavené heslo? */
export async function isValidSession(
  token: string | undefined
): Promise<boolean> {
  const pw = adminPassword();
  if (!pw || !token) return false;
  return safeEqual(token, await sessionToken(pw));
}
