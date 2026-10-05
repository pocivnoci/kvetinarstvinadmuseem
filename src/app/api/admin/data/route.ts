import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { isDbConfigured, loadDoc, saveDoc } from "@/lib/admin/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Data adminu. Prohlížeč nemluví s databází přímo — chodí sem, a teprve
 * tahle routa (na serveru) sáhne do Supabase tajným klíčem.
 *
 * Každé volání ověřuje stejnou přihlašovací cookie jako stránky /admin.
 */
const guard = requireAdmin;

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ mode: "local" as const });
  }

  try {
    const doc = await loadDoc();
    return NextResponse.json({ mode: "cloud" as const, doc });
  } catch (e) {
    return NextResponse.json(
      { mode: "cloud" as const, error: e instanceof Error ? e.message : "Nepodařilo se načíst data." },
      { status: 502 }
    );
  }
}

export async function PUT(req: Request) {
  const denied = await guard();
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json({ mode: "local" as const }, { status: 409 });
  }

  let payload: { doc?: unknown; revision?: number | null };
  try {
    payload = (await req.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }
  if (!payload.doc || typeof payload.doc !== "object") {
    return NextResponse.json({ error: "Chybí data k uložení." }, { status: 400 });
  }
  // Zápis bez čísla revize by v databázi přepsal všechno tím, co zrovna
  // drží prohlížeč — a ten po nepovedeném načtení nedrží nic. Klient si
  // úpravy podrží a pošle je, až bude vědět, na čem staví.
  if (typeof payload.revision !== "number") {
    return NextResponse.json(
      { conflict: true, error: "Uložení bez známé verze dat. Načtěte data znovu." },
      { status: 409 }
    );
  }

  try {
    const result = await saveDoc(payload.doc, payload.revision);
    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Uložení selhalo." },
      { status: 502 }
    );
  }
}
