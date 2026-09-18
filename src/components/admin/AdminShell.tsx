"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Ico, type IconName } from "./icons";
import { SyncBadge } from "./SyncBadge";

const NAV: { href: string; label: string; icon: IconName; short?: string }[] = [
  { href: "/admin", label: "Přehled", icon: "home" },
  { href: "/admin/ukoly", label: "Úkoly a nákup", icon: "check", short: "Úkoly" },
  { href: "/admin/objednavky", label: "Objednávky", icon: "orders" },
  { href: "/admin/kalendar", label: "Kalendář", icon: "calendar" },
  { href: "/admin/penize", label: "Peníze", icon: "money" },
  { href: "/admin/zakaznici", label: "Zákazníci", icon: "people" },
  { href: "/admin/sklad", label: "Sklad", icon: "stock" },
  { href: "/admin/kalkulacka", label: "Kalkulačka kytice", icon: "calc", short: "Kalkulačka" },
  { href: "/admin/svatky", label: "Svátky a sezóna", icon: "star", short: "Svátky" },
  { href: "/admin/pece", label: "Péče o květiny", icon: "leaf", short: "Péče" },
  { href: "/admin/nastaveni", label: "Nastavení", icon: "settings" },
];

/** Na mobilu se do spodní lišty vejde 5 záložek. */
const TABS = ["/admin", "/admin/ukoly", "/admin/objednavky", "/admin/penize", "/admin/sklad"];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin">
      <header className="admin-topbar">
        <Link href="/admin" aria-label="Přehled">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Květiny nad museem" />
        </Link>
        <SyncBadge compact />
        <div className="row" style={{ gap: "0.35rem" }}>
          {NAV.filter((n) => !TABS.includes(n.href)).map((n) => {
            const I = Ico[n.icon];
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-label={n.label}
                aria-current={isActive(pathname, n.href) ? "page" : undefined}
                className="btn btn-ghost btn-sm"
                style={{ padding: "0.45rem" }}
              >
                <I className="" />
              </Link>
            );
          })}
        </div>
      </header>

      <nav className="admin-nav" aria-label="Sekce adminu">
        <Link href="/admin" className="admin-nav-brand" style={{ padding: "0.25rem 0.6rem 1rem" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" />
          <span>admin</span>
        </Link>
        {NAV.map((n) => {
          const I = Ico[n.icon];
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(pathname, n.href) ? "page" : undefined}
            >
              <I />
              {n.label}
            </Link>
          );
        })}
        <div className="admin-nav-foot">
          <SyncBadge />
          <a href="/" target="_blank" rel="noreferrer">
            <Ico.web />
            Zobrazit web
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); void logout(); }}>
            <Ico.logout />
            Odhlásit
          </a>
        </div>
      </nav>

      <main className="admin-main">{children}</main>

      <nav className="admin-tabs" aria-label="Rychlá navigace">
        {NAV.filter((n) => TABS.includes(n.href)).map((n) => {
          const I = Ico[n.icon];
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(pathname, n.href) ? "page" : undefined}
            >
              <I />
              {n.short ?? n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
