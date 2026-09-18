import { formatCzk, formatDate } from "./format";
import type { Order } from "./types";

/**
 * Hotové texty zpráv zákazníkovi.
 *
 * Zatím jediná zpráva — „kytice je hotová". Tu floristka posílá pětkrát
 * až desetkrát denně a ťuká ji palcem mezi dvěma zákazníky. Potvrzení
 * objednávky a „vezeme to" se posílají řádově míň, takže ať se nejdřív
 * měsíc ukáže, jestli se tahle vůbec používá.
 *
 * Text je schválně natvrdo tady, ne v Nastavení: nastavení se do databáze
 * ukládá po sloupcích, takže tři textová pole znamenají další migraci a
 * zásah do obou funkcí kvůli tomu, že si někdo jednou za rok přepíše
 * čárku. Změna textu je změna tohoto souboru.
 */

/** 6. pád — vsazuje se do „čeká na Vás v …". */
const KRAM_KDE = "Květinách nad museem, Vinohradská 6";
const HODINY = "Otevřeno máme Po–Pá 8–18.";

/** Co ještě zbývá doplatit. Záloha i cena jsou nepovinné. */
function doplatek(o: Order): number | undefined {
  const cena = o.price ?? 0;
  if (cena <= 0) return undefined;
  const zaloha = o.deposit ?? 0;
  const zbyva = cena - zaloha;
  return zbyva > 0 ? zbyva : undefined;
}

/**
 * Zpráva „kytice je hotová".
 *
 * Skládá se z podmíněných částí: cena i čas jsou v objednávce nepovinné,
 * takže natvrdo vložené `${price}` by zákazníkovi poslalo „kytice za
 * undefined Kč". Co v objednávce není, se do zprávy nedostane.
 */
export function zpravaHotovo(o: Order): string {
  const kus: string[] = ["Dobrý den,"];

  if (o.fulfillment === "rozvoz") {
    kus.push(`kytice je hotová, vezeme ji ${formatDate(o.date)}${o.time ? ` kolem ${o.time}` : ""}.`);
  } else {
    kus.push(`kytice je hotová a čeká na Vás v ${KRAM_KDE}.`);
    kus.push(HODINY);
  }

  const zbyva = doplatek(o);
  if (zbyva !== undefined) {
    kus.push(o.deposit ? `Doplatit zbývá ${formatCzk(zbyva)}.` : `Cena je ${formatCzk(zbyva)}.`);
  }

  kus.push("Děkujeme a hezký den, Květiny nad museem");
  return kus.join(" ");
}
