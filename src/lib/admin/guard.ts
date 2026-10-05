import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminPassword, isValidSession } from "./auth";

/**
 * Ověření pro API routy adminu — stejná přihlašovací cookie jako stránky
 * /admin. Vrací odpověď 401, nebo null, když je volající přihlášený.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  // Ve vývoji bez nastaveného hesla platí stejná výjimka jako v middleware.
  if (!adminPassword() && process.env.NODE_ENV === "development") return null;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (await isValidSession(token)) return null;
  return NextResponse.json({ error: "Nepřihlášeno." }, { status: 401 });
}
