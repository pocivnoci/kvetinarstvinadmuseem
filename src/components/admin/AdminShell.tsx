"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAdmin } from "@/lib/admin/store";
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
  const { mode, status } = useAdmin();
  /** Na mobilu se boční navigace vysouvá z hamburgeru. */
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Stav uložení je v patičce, dole na stránce. Když se ale něco neuložilo,
  // musí to být vidět hned — proto tečka na hamburgeru.
  const syncProblem = mode === "cloud" && (status === "offline" || status === "error");

  // Po kliknutí na odkaz v menu se menu zavře samo.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const burger = burgerRef.current;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Stránka pod otevřeným menu se nemá posouvat.
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      burger?.focus();
    };
  }, [menuOpen]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin">
      <header className="admin-topbar">
        <button
          ref={burgerRef}
          type="button"
          className="admin-burger"
          aria-label={syncProblem ? "Menu — něco se neuložilo" : "Menu"}
          aria-expanded={menuOpen}
          aria-controls="admin-menu"
          onClick={() => setMenuOpen(true)}
        >
          <Ico.menu />
          {syncProblem && <i aria-hidden />}
        </button>
        <Link href="/admin" aria-label="Přehled" className="admin-topbar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Květiny nad museem" />
        </Link>
      </header>

      <div className="admin-backdrop" hidden={!menuOpen} onClick={() => setMenuOpen(false)} aria-hidden />

      <nav id="admin-menu" className={`admin-nav ${menuOpen ? "is-open" : ""}`} aria-label="Sekce adminu">
        <button
          ref={closeRef}
          type="button"
          className="admin-nav-close"
          aria-label="Zavřít menu"
          onClick={() => setMenuOpen(false)}
        >
          <Ico.close />
        </button>
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

      <main className="admin-main">
        {children}
        {/* Na počítači je stav uložení dole v boční liště, na mobilu tady. */}
        <footer className="admin-foot">
          <SyncBadge />
        </footer>
      </main>

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
