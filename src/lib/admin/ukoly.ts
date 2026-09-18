import { newId } from "./store";
import { addDays, nextRepeat, todayIso } from "./format";
import type { ShoppingItem, Task } from "./types";

/**
 * Práce s úkoly a nákupním seznamem. Logika je tady, ať ji obrazovka
 * jen volá a dá se otestovat bez prohlížeče.
 */

export type TaskBucket = "po-termínu" | "dnes" | "brzy" | "kdykoliv" | "hotovo";

/** Do které přihrádky úkol patří. Řídí i pořadí na obrazovce. */
export function taskBucket(t: Task, today = todayIso()): TaskBucket {
  if (t.done) return "hotovo";
  if (!t.due) return "kdykoliv";
  if (t.due < today) return "po-termínu";
  if (t.due === today) return "dnes";
  return "brzy";
}

export const BUCKET_ORDER: TaskBucket[] = ["po-termínu", "dnes", "brzy", "kdykoliv", "hotovo"];

export const BUCKET_LABEL: Record<TaskBucket, string> = {
  "po-termínu": "Po termínu",
  dnes: "Na dnešek",
  brzy: "Brzy",
  kdykoliv: "Kdykoliv",
  hotovo: "Hotovo",
};

/** Úkoly, které má smysl dělat dnes: po termínu a dnešní. */
export function tasksForToday(tasks: Task[], today = todayIso()): Task[] {
  return tasks
    .filter((t) => !t.done && t.due && t.due <= today)
    .sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));
}

export function sortTasks(tasks: Task[], today = todayIso()): Task[] {
  return [...tasks].sort((a, b) => {
    const ba = BUCKET_ORDER.indexOf(taskBucket(a, today));
    const bb = BUCKET_ORDER.indexOf(taskBucket(b, today));
    if (ba !== bb) return ba - bb;
    if (a.done && b.done) return (b.doneAt ?? "").localeCompare(a.doneAt ?? "");
    return (a.due ?? "9999").localeCompare(b.due ?? "9999") || a.createdAt.localeCompare(b.createdAt);
  });
}

/**
 * Odškrtnutí úkolu. U opakovaného se rovnou založí další termín, takže
 * floristka nemusí nic zadávat znovu — jen odškrtne a příští týden to
 * na ni zase vyskočí.
 */
export function toggleTask(tasks: Task[], id: string, now: string): Task[] {
  const t = tasks.find((x) => x.id === id);
  if (!t) return tasks;

  if (t.done) {
    return tasks.map((x) => (x.id === id ? { ...x, done: false, doneAt: undefined } : x));
  }

  const hotovy: Task = { ...t, done: true, doneAt: now };
  const out = tasks.map((x) => (x.id === id ? hotovy : x));

  if (t.repeat !== "zadne" && t.due) {
    // Další termín počítáme od dneška, ne od zmeškaného data, aby se
    // po návratu z dovolené nenahromadilo pět stejných úkolů.
    const zaklad = t.due < now.slice(0, 10) ? now.slice(0, 10) : t.due;
    out.push({
      id: newId(),
      title: t.title,
      note: t.note,
      due: nextRepeat(zaklad, t.repeat),
      done: false,
      repeat: t.repeat,
      createdAt: now,
    });
  }
  return out;
}

/** Nový úkol s rozumnými výchozími hodnotami. */
export function newTask(title: string, due: string | undefined, now: string): Task {
  return { id: newId(), title: title.trim(), due, done: false, repeat: "zadne", createdAt: now };
}

/* ── Nákupní seznam ─────────────────────────────────────────────────── */

/** Seskupení podle dodavatele — na burze se nakupuje po stáncích. */
export function groupBySupplier(items: ShoppingItem[]): { supplier: string; items: ShoppingItem[] }[] {
  const map = new Map<string, ShoppingItem[]>();
  for (const i of items) {
    const key = i.supplier?.trim() || "Bez dodavatele";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(i);
  }
  return [...map.entries()]
    .map(([supplier, items]) => ({
      supplier,
      items: items.sort((a, b) => Number(a.bought) - Number(b.bought) || a.name.localeCompare(b.name, "cs")),
    }))
    .sort((a, b) =>
      a.supplier === "Bez dodavatele" ? 1 : b.supplier === "Bez dodavatele" ? -1 : a.supplier.localeCompare(b.supplier, "cs")
    );
}

export function toggleShopping(items: ShoppingItem[], id: string, now: string): ShoppingItem[] {
  return items.map((i) =>
    i.id === id ? { ...i, bought: !i.bought, boughtAt: !i.bought ? now : undefined } : i
  );
}

export function newShoppingItem(name: string, now: string): ShoppingItem {
  return { id: newId(), name: name.trim(), bought: false, createdAt: now };
}

/**
 * Návrhy k nákupu ze skladu: co dochází nebo doslouží do pár dní.
 * Nabízí jen to, co v seznamu ještě není.
 */
export function shoppingSuggestions(
  stock: { id: string; name: string; qty: number; unit: string; supplier?: string; shelfLifeDays: number; receivedAt: string }[],
  shopping: ShoppingItem[],
  today = todayIso()
): { name: string; supplier?: string; duvod: string }[] {
  const uz = new Set(shopping.filter((s) => !s.bought).map((s) => s.name.toLowerCase()));
  const out: { name: string; supplier?: string; duvod: string }[] = [];

  for (const s of stock) {
    if (uz.has(s.name.toLowerCase())) continue;
    if (s.qty <= 0) {
      out.push({ name: s.name, supplier: s.supplier, duvod: "došlo" });
    } else if (s.shelfLifeDays > 0 && addDays(s.receivedAt, s.shelfLifeDays) <= addDays(today, 2)) {
      out.push({ name: s.name, supplier: s.supplier, duvod: "dojde trvanlivost" });
    } else if (s.qty <= 3 && s.shelfLifeDays > 0) {
      out.push({ name: s.name, supplier: s.supplier, duvod: `zbývá ${s.qty} ${s.unit}` });
    }
  }
  return out;
}
