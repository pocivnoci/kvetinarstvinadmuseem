import { addDays, todayIso } from "./format";
import { DEFAULT_SETTINGS, type AdminDoc } from "./types";

/** Ukázková data — ať si floristka admin proklikne dřív, než do něj něco zadá. */
export function ukazkovaData(): AdminDoc {
  const t = todayIso();
  const now = new Date().toISOString();
  return {
    version: 1,
    savedAt: now,
    nextOrderNumber: 6,
    settings: { ...DEFAULT_SETTINGS },
    customers: [
      { id: "c1", name: "Jana Nováková", phone: "777 123 456", email: "jana@example.cz", note: "Miluje pivoňky a pastel. Nechce lilie (alergie). Kupuje pro maminku.", namedayName: "Jana", birthday: "03-14", createdAt: now },
      { id: "c2", name: "Petr Svoboda", phone: "602 987 654", note: "Firemní objednávky — Ateliér Svoboda, fakturu na IČO.", namedayName: "Petr", createdAt: now },
      { id: "c3", name: "Tereza Dvořáková", phone: "731 555 222", address: "Slezská 12, Praha 2, 3. patro", note: "Rozvoz do práce, ráda sušené a zemité tóny.", namedayName: "Tereza", birthday: "10-15", createdAt: now },
    ],
    orders: [
      { id: "o1", cislo: 1, createdAt: now, updatedAt: now, customerName: "Jana Nováková", customerPhone: "777 123 456", fulfillment: "vyzvednuti", date: t, time: "10:30", occasion: "Narozeniny", description: "Kulatá kytice v pastelech — pivoňky, eustoma, trochu eukalyptu. Střední, kraftový papír. BEZ LILIÍ.", price: 1200, deposit: 500, paid: false, cardMessage: "Všechno nejlepší, mami!\nS láskou Jana", status: "v-priprave" },
      { id: "o2", cislo: 2, createdAt: now, updatedAt: now, customerName: "Tereza Dvořáková", customerPhone: "731 555 222", fulfillment: "rozvoz", date: t, time: "15:00", address: "Slezská 12, Praha 2, 3. patro", recipientName: "Tereza Dvořáková", occasion: "Poděkování", description: "Sušená kytice v zemitých tónech — pampas, lagurus, sušená růže. Do skleněné vázy (přidat).", price: 1650, paid: true, status: "hotova" },
      { id: "o3", cislo: 3, createdAt: now, updatedAt: now, customerName: "Petr Svoboda", customerPhone: "602 987 654", fulfillment: "vyzvednuti", date: addDays(t, 2), time: "09:00", occasion: "Firemní / event", description: "3× stolní aranžmá do nízkých mís, bílá a zelená, bez vůně. Pro vernisáž.", price: 4500, paid: false, note: "Faktura na IČO — poslat do e-mailu.", status: "potvrzena" },
      { id: "o4", cislo: 4, createdAt: now, updatedAt: now, customerName: "Marie Černá", customerPhone: "608 111 333", fulfillment: "vyzvednuti", date: addDays(t, 4), occasion: "Pohřeb / smuteční", description: "Smuteční vazba — bílé chryzantémy, lilie, zeleň. Stuha: „S láskou vzpomínáme“.", price: 2200, paid: false, status: "nova" },
      { id: "o5", cislo: 5, createdAt: now, updatedAt: now, customerName: "Jana Nováková", customerPhone: "777 123 456", fulfillment: "vyzvednuti", date: addDays(t, -20), time: "17:00", occasion: "Jen tak pro radost", description: "Malá kytice tulipánů, růžové a bílé.", price: 450, paid: true, status: "predana" },
    ],
    stock: [
      { id: "s1", name: "Růže Red Naomi 60 cm", category: "rezane", qty: 40, unit: "ks", costPrice: 28, salePrice: 79, receivedAt: addDays(t, -2), shelfLifeDays: 8, supplier: "Květinová burza" },
      { id: "s2", name: "Pivoňka Sarah Bernhardt", category: "rezane", qty: 15, unit: "ks", costPrice: 45, salePrice: 120, receivedAt: addDays(t, -5), shelfLifeDays: 6, supplier: "Květinová burza" },
      { id: "s3", name: "Eustoma bílá", category: "rezane", qty: 20, unit: "ks", costPrice: 22, salePrice: 65, receivedAt: addDays(t, -1), shelfLifeDays: 10 },
      { id: "s4", name: "Eukalyptus cinerea", category: "rezane", qty: 12, unit: "svazek", costPrice: 60, salePrice: 150, receivedAt: addDays(t, -6), shelfLifeDays: 14 },
      { id: "s5", name: "Gerbera mix", category: "rezane", qty: 8, unit: "ks", costPrice: 18, salePrice: 55, receivedAt: addDays(t, -7), shelfLifeDays: 7, note: "zlevnit" },
      { id: "s6", name: "Monstera 19 cm", category: "hrnkove", qty: 4, unit: "ks", costPrice: 180, salePrice: 490, receivedAt: addDays(t, -12), shelfLifeDays: 0 },
      { id: "s7", name: "Pampas béžová", category: "susene", qty: 25, unit: "ks", costPrice: 35, salePrice: 95, receivedAt: addDays(t, -40), shelfLifeDays: 0 },
      { id: "s8", name: "Kraftový papír 70 cm", category: "doplnky", qty: 2, unit: "role", costPrice: 320, receivedAt: addDays(t, -30), shelfLifeDays: 0 },
    ],
  };
}
