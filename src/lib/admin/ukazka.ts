import { addDays, shiftMonth, todayIso, ymOf } from "./format";
import { DEFAULT_SETTINGS, type AdminDoc } from "./types";

/** Denní tržby za poslední dva měsíce — víkendy zavřeno, pátky silnější. */
function trzby(today: string) {
  const out = [];
  for (let i = 0; i < 60; i++) {
    const date = addDays(today, -i);
    const dow = new Date(date + "T12:00:00").getDay();
    if (dow === 0 || dow === 6) continue; // Po–Pá
    // Pseudonáhodně, ale stabilně: od dne v měsíci, ať se čísla nemění při každém renderu.
    const seed = (Number(date.slice(8)) * 37 + Number(date.slice(5, 7)) * 11) % 100;
    const base = 3200 + seed * 45 + (dow === 5 ? 2600 : 0);
    out.push({
      id: `t-${date}`,
      date,
      cash: Math.round((base * 0.55) / 10) * 10,
      card: Math.round((base * 0.38) / 10) * 10,
      other: Math.round((base * 0.07) / 10) * 10,
      note: dow === 5 ? "pátek — nejsilnější den týdne" : undefined,
    });
  }
  return out;
}

/** Faktury: nákup květin každý týden, nájem a energie měsíčně, pár vydaných firmám. */
function faktury(today: string) {
  const ym = ymOf(today);
  const prev = shiftMonth(ym, -1);
  const d = (m: string, day: number) => `${m}-${String(day).padStart(2, "0")}`;
  return [
    { id: "f1", kind: "prijata" as const, number: "FV-2026-3311", party: "Květinová burza Praha", issuedAt: d(ym, 3), dueAt: d(ym, 17), amount: 18400, category: "Nákup květin", paid: true, paidAt: d(ym, 9) },
    { id: "f2", kind: "prijata" as const, number: "FV-2026-3390", party: "Květinová burza Praha", issuedAt: d(ym, 10), dueAt: d(ym, 24), amount: 15900, category: "Nákup květin", paid: true, paidAt: d(ym, 15) },
    { id: "f3", kind: "prijata" as const, number: "2026/0912", party: "Obaly Kraft s.r.o.", issuedAt: d(ym, 8), dueAt: d(ym, 22), amount: 4300, category: "Obaly a stuhy", paid: false },
    { id: "f4", kind: "prijata" as const, number: "NAJ-09", party: "Správa domu Vinohradská", issuedAt: d(ym, 1), dueAt: d(ym, 15), amount: 32000, category: "Nájem", paid: true, paidAt: d(ym, 2) },
    { id: "f5", kind: "prijata" as const, number: "EN-2026-09", party: "Energie ČR", issuedAt: d(prev, 28), dueAt: addDays(today, -3), amount: 5400, category: "Energie", paid: false, note: "po splatnosti — zaplatit" },
    { id: "f6", kind: "vydana" as const, number: "2026-0141", party: "Ateliér Svoboda s.r.o.", issuedAt: d(ym, 6), dueAt: addDays(today, 8), amount: 12500, paid: false, note: "vernisáž — 3 aranžmá" },
    { id: "f7", kind: "vydana" as const, number: "2026-0138", party: "Hotel Vinohrady", issuedAt: d(prev, 20), dueAt: d(ym, 4), amount: 9800, paid: true, paidAt: d(ym, 3), note: "týdenní vazby na recepci" },
    { id: "f8", kind: "prijata" as const, number: "FV-2026-3201", party: "Květinová burza Praha", issuedAt: d(prev, 12), dueAt: d(prev, 26), amount: 21100, category: "Nákup květin", paid: true, paidAt: d(prev, 20) },
    { id: "f9", kind: "prijata" as const, number: "NAJ-08", party: "Správa domu Vinohradská", issuedAt: d(prev, 1), dueAt: d(prev, 15), amount: 32000, category: "Nájem", paid: true, paidAt: d(prev, 2) },
  ];
}

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
    tasks: [
      { id: "u1", title: "Objednat růže na Valentýna", note: "Red Naomi 60 cm, letos aspoň 200 ks", due: addDays(t, 3), done: false, repeat: "zadne" as const, createdAt: now },
      { id: "u2", title: "Zalít rostliny v regálu", due: t, done: false, repeat: "tydne" as const, createdAt: now },
      { id: "u3", title: "Vyhodit prošlé gerbery a přepsat cedulky", due: t, done: false, repeat: "zadne" as const, createdAt: now },
      { id: "u4", title: "Poslat účetní faktury za minulý měsíc", due: addDays(t, 5), done: false, repeat: "mesicne" as const, createdAt: now },
      { id: "u5", title: "Umýt vázy a kýble", due: addDays(t, -1), done: true, doneAt: now, repeat: "tydne" as const, createdAt: now },
    ],
    shopping: [
      { id: "n1", name: "Růže Red Naomi 60 cm", qty: 60, unit: "ks", supplier: "Květinová burza", bought: false, createdAt: now },
      { id: "n2", name: "Eustoma bílá", qty: 20, unit: "ks", supplier: "Květinová burza", bought: false, createdAt: now },
      { id: "n3", name: "Kraftový papír 70 cm", qty: 2, unit: "role", supplier: "Obaly Kraft", note: "došel skoro celý", bought: false, createdAt: now },
      { id: "n4", name: "Stuha sametová 25 mm", supplier: "Obaly Kraft", bought: false, createdAt: now },
      { id: "n5", name: "Floristická pěna", qty: 1, unit: "karton", bought: true, boughtAt: now, createdAt: now },
    ],
    takings: trzby(t),
    invoices: faktury(t),
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
