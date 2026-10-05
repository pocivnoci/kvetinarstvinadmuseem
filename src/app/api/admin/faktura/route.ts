import { NextResponse } from "next/server";
import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { requireAdmin } from "@/lib/admin/guard";
import { INVOICE_CATEGORIES, type InvoiceScan } from "@/lib/admin/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Přečtení vícestránkového PDF umí trvat i přes minutu.
export const maxDuration = 120;

/**
 * Čtení faktury z fotky nebo PDF. Prohlížeč pošle soubor, tahle routa ho
 * dá přečíst Gemini a vrátí předvyplněná pole formuláře. Nic se tu
 * neukládá — fakturu uloží až floristka, když údaje zkontroluje.
 *
 * Čte levný model Gemini Flash-Lite (pár haléřů za doklad). Jiný model
 * jde nastavit proměnnou GEMINI_MODEL bez zásahu do kódu.
 */

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

// HEIC je výchozí formát fotek z iPhonu — prohlížeč ho nezmenší, Gemini ho přečte.
const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_BYTES = 20 * 1024 * 1024;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["isInvoice", "kind", "number", "party", "issuedAt", "dueAt", "amount", "category", "paid", "note"],
  properties: {
    isInvoice: { type: "boolean", description: "Je na obrázku faktura, účtenka nebo daňový doklad?" },
    kind: { type: "string", enum: ["prijata", "vydana"] },
    number: { type: "string", description: "Číslo faktury, jinak variabilní symbol. Prázdné, když není." },
    party: { type: "string", description: "Název protistrany (dodavatel u přijaté, odběratel u vydané)." },
    issuedAt: { type: "string", description: "Datum vystavení YYYY-MM-DD, prázdné když není." },
    dueAt: { type: "string", description: "Datum splatnosti YYYY-MM-DD, prázdné když není." },
    amount: { type: "number", description: "Celkem k úhradě v Kč včetně DPH. 0 když nejde přečíst." },
    category: { type: "string", enum: [...INVOICE_CATEGORIES] },
    paid: { type: "boolean", description: "Je doklad už zaplacený (účtenka, „uhrazeno“, platba kartou, zálohou)?" },
    note: {
      type: "string",
      description: "Krátce česky, co je potřeba ověřit (nečitelné, cizí měna, chybějící údaj). Prázdné, když je vše jasné.",
    },
  },
} as const;

const SYSTEM = `Čteš doklady pro malé pražské květinářství „Květiny nad museem“ (Vinohradská 6, Praha). Z přiloženého dokladu vytáhni údaje do zadaného formátu.

- kind: „vydana“ jen když je dodavatelem (vystavitelem) samo květinářství Květiny nad museem; jinak „prijata“.
- party: protistrana — u přijaté dodavatel, u vydané odběratel. Obchodní název, bez adresy a IČO.
- amount: konečná částka k úhradě včetně DPH v Kč. Květinářství není plátce DPH, takže DPH je pro něj náklad — nikdy nevracej základ bez DPH, pokud je na dokladu i celková částka. Když je odečtená záloha, ber částku, která zbývá k úhradě. Když je měna jiná než Kč, vrať částku tak, jak je, a napiš to do note.
- category: u přijaté vyber nejbližší kategorii výdaje (řezané květiny, hrnkové rostliny a zeleň z velkoobchodu = „Nákup květin“; keramika, svíčky, dekorace = „Nákup zboží a doplňků“; papír, celofán, stuhy, krabice = „Obaly a stuhy“). U vydané dej „Ostatní“.
- Data převeď na YYYY-MM-DD. Datum, které na dokladu není, nech prázdné — nevymýšlej ho.
- Když něco nejde spolehlivě přečíst, nech pole prázdné (u částky 0) a napiš to do note.
- Když přiložený soubor fakturou ani účtenkou není, vrať isInvoice false a ostatní pole prázdná.`;

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Čtení faktur není zapnuté — na serveru chybí GEMINI_API_KEY." },
      { status: 503 }
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    file = f instanceof File ? f : null;
  } catch {
    // níže jedna chybová hláška pro všechno
  }
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Chybí soubor s fakturou." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Soubor je větší než 20 MB." }, { status: 413 });
  }
  if (!FILE_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tenhle typ souboru neumím přečíst. Pošlete fotku (JPG, PNG) nebo PDF." },
      { status: 415 }
    );
  }

  const data = Buffer.from(await file.arrayBuffer()).toString("base64");
  const ai = new GoogleGenAI({ apiKey });
  let text: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ inlineData: { mimeType: file.type, data } }, { text: "Přečti tenhle doklad." }] }],
      config: {
        systemInstruction: SYSTEM,
        responseMimeType: "application/json",
        responseJsonSchema: SCHEMA,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });
    text = response.text;
  } catch (e) {
    if (e instanceof ApiError) {
      if (e.status === 429) {
        return NextResponse.json({ error: "Moc požadavků najednou, zkuste to za chvíli." }, { status: 429 });
      }
      if (e.status === 400) {
        return NextResponse.json({ error: "Soubor se nepodařilo přečíst — zkuste ostřejší fotku nebo PDF." }, { status: 422 });
      }
      return NextResponse.json({ error: `Čtení selhalo (${e.status}). Zkuste to znovu.` }, { status: 502 });
    }
    return NextResponse.json({ error: "Čtení selhalo. Zkuste to znovu." }, { status: 502 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text ?? "") as Record<string, unknown>;
  } catch {
    // prázdná odpověď = model doklad odmítl nebo ho nedočetl
    return NextResponse.json({ error: "Doklad se nepodařilo přečíst. Zadejte ho prosím ručně." }, { status: 422 });
  }

  if (raw.isInvoice === false) {
    return NextResponse.json({ error: "Na obrázku jsem fakturu ani účtenku nenašel." }, { status: 422 });
  }

  return NextResponse.json({ scan: sanitize(raw) });
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const date = (v: unknown) => (ISO.test(str(v)) ? str(v) : undefined);

/** Výstup modelu ještě jednou projdeme — do formuláře nesmí nic, co by ho rozbilo. */
function sanitize(raw: Record<string, unknown>): InvoiceScan {
  const kind = raw.kind === "vydana" ? "vydana" : "prijata";
  const category = str(raw.category);
  const amount = typeof raw.amount === "number" && Number.isFinite(raw.amount) && raw.amount > 0 ? raw.amount : undefined;
  return {
    kind,
    number: str(raw.number),
    party: str(raw.party),
    issuedAt: date(raw.issuedAt),
    dueAt: date(raw.dueAt),
    amount: amount !== undefined ? Math.round(amount * 100) / 100 : undefined,
    category: (INVOICE_CATEGORIES as readonly string[]).includes(category) ? category : undefined,
    paid: raw.paid === true,
    warning: str(raw.note) || undefined,
  };
}
