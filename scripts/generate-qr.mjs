#!/usr/bin/env node
/**
 * Generátor QR kódů na /odkazy — SVG (vektor, pro sazbu) a PNG (300 DPI, pro tisk).
 *
 *   npm run qr
 *
 * Výstup jde do public/qr/, pro každou variantu ?src= jeden pár souborů:
 *   odkazy-vizitka.svg  odkazy-vizitka.png
 *   odkazy-samolepka.svg  odkazy-samolepka.png
 *
 * Přidat variantu = přidat řádek do VARIANTY (a hodnotu do SRC_VALUES
 * v src/lib/odkazy-utm.ts, jinak ji stránka zahodí).
 *
 * Volitelné proměnné prostředí:
 *   QR_BASE_URL  cílová adresa (default produkční /odkazy)
 *   QR_SIZE_MM   tištěná velikost hrany v mm (default 40)
 *   QR_DPI       rozlišení PNG (default 300)
 *   QR_DARK / QR_LIGHT  barvy modulů (default značkové noir na cream)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "qr");

const BASE_URL = process.env.QR_BASE_URL ?? "https://kvetinynadmuseem.cz/odkazy";
const SIZE_MM = Number(process.env.QR_SIZE_MM ?? 40);
const DPI = Number(process.env.QR_DPI ?? 300);
const DARK = process.env.QR_DARK ?? "#1a1814";
const LIGHT = process.env.QR_LIGHT ?? "#f4ede0";

/** Varianty nosičů — hodnota jde do ?src= a stránka ji propíše do utm_content. */
const VARIANTY = ["vizitka", "samolepka"];

/**
 * Error correction M (~15 %) — doporučený kompromis pro tisk. Vyšší úroveň
 * zahustí modul a u malé vizitky se hůř čte, nižší nepřežije škrábanec.
 * Margin 4 moduly je normou předepsaná klidová zóna (ISO/IEC 18004), méně
 * způsobuje, že čtečka QR nenajde.
 */
const QR_OPTIONS = {
  errorCorrectionLevel: "M",
  margin: 4,
  color: { dark: DARK, light: LIGHT },
};

/** px pro požadovanou tištěnou velikost při daném DPI. */
const pxForPrint = Math.round((SIZE_MM / 25.4) * DPI);

// ── pHYs ────────────────────────────────────────────────────────────────
// Knihovna qrcode zapíše PNG bez informace o rozlišení, takže ho tiskové
// programy berou jako 72 DPI a obrázek nafouknou. Doplníme chunk pHYs
// s fyzickým rozlišením, aby se QR vysadil v reálné velikosti.

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function withPhys(png, dpi) {
  const pixelsPerMetre = Math.round(dpi * 39.3701);

  const data = Buffer.alloc(9);
  data.writeUInt32BE(pixelsPerMetre, 0); // osa X
  data.writeUInt32BE(pixelsPerMetre, 4); // osa Y
  data.writeUInt8(1, 8); // jednotka = metr

  const type = Buffer.from("pHYs", "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([type, data])), 0);

  // IHDR je vždycky první chunk: 8 B signatura + 4 B délka + 4 B typ + 13 B data + 4 B CRC
  const afterIhdr = 8 + 4 + 4 + 13 + 4;
  return Buffer.concat([
    png.subarray(0, afterIhdr),
    length,
    type,
    data,
    crc,
    png.subarray(afterIhdr),
  ]);
}

// ── generování ──────────────────────────────────────────────────────────

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const src of VARIANTY) {
    const url = `${BASE_URL}?src=${encodeURIComponent(src)}`;
    const stem = `odkazy-${src}`;

    const svg = await QRCode.toString(url, { ...QR_OPTIONS, type: "svg" });
    await writeFile(path.join(OUT_DIR, `${stem}.svg`), svg, "utf8");

    const png = await QRCode.toBuffer(url, {
      ...QR_OPTIONS,
      type: "png",
      width: pxForPrint,
    });
    await writeFile(path.join(OUT_DIR, `${stem}.png`), withPhys(png, DPI));

    console.log(
      `  ${stem}.svg  ${stem}.png  ${pxForPrint}×${pxForPrint} px  (${SIZE_MM} mm @ ${DPI} DPI)`
    );
    console.log(`    → ${url}`);
  }

  console.log(`\nHotovo — public/qr/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
