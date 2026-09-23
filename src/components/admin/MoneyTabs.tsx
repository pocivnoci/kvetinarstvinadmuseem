"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/penize", label: "Měsíc" },
  { href: "/admin/penize/vyplata", label: "Výplata" },
  { href: "/admin/penize/faktury", label: "Faktury" },
  { href: "/admin/penize/rok", label: "Rok" },
];

export function MoneyTabs() {
  const pathname = usePathname();
  return (
    <div className="chips" style={{ marginBottom: "1.25rem" }}>
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className="chip" aria-pressed={pathname === t.href}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
