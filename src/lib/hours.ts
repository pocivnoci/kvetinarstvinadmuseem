const OPEN_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const OPENS_MINUTE = 8 * 60;
const CLOSES_MINUTE = 18 * 60;

/** Je krámek právě otevřený? Počítáno podle reálného pražského času (Po–Pá 8–18), bez ohledu na časové pásmo návštěvníka. */
export function isShopOpen(date: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);

  if (!OPEN_DAYS.includes(weekday)) return false;
  const minutesSinceMidnight = hour * 60 + minute;
  return (
    minutesSinceMidnight >= OPENS_MINUTE && minutesSinceMidnight < CLOSES_MINUTE
  );
}
