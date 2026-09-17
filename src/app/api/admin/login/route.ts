import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminPassword,
  safeEqual,
  sessionToken,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

/** POST { password } → nastaví přihlašovací cookie, nebo 401. */
export async function POST(req: Request) {
  const pw = adminPassword();
  if (!pw) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Heslo do adminu není nastavené. Na Vercelu přidejte proměnnou prostředí ADMIN_PASSWORD a nasaďte web znovu.",
      },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    password = "";
  }

  if (!safeEqual(password, pw)) {
    // Malé zdržení — brzda proti hádání hesla.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { ok: false, error: "Nesprávné heslo." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: await sessionToken(pw),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}
