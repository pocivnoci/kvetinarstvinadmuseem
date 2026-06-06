"use client";

import { useEffect, useState } from "react";
import { altLocalePath, type Dictionary, type Locale } from "@/lib/i18n";

export function Nav({ t, locale }: { t: Dictionary; locale: Locale }) {
  const { NAV_LINKS, SHOP, UI } = t;
  const altPath = altLocalePath(locale);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Nad tmavým hero (nahoře) je nav světlá, po odscrollování tmavá na růžové.
  const linkColor = scrolled ? "var(--ink)" : "var(--cream)";
  const hoverColor = scrolled ? "var(--sage-deep)" : "var(--gilt-light)";
  const barColor = scrolled ? "var(--ink)" : "var(--cream)";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(242, 214, 220, 0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(1.1)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.1)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(109, 122, 82, 0.12)"
            : "1px solid transparent",
        }}
      >
        <div className="container flex items-center justify-between py-4 md:py-5">
          <a href="#" className="flex items-center" aria-label={SHOP.name}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt={SHOP.name}
              className="h-14 md:h-[4.5rem] w-auto transition-[filter] duration-500"
              style={{ filter: scrolled ? "none" : "invert(1)" }}
            />
          </a>

          <ul className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm tracking-wider transition-colors"
                  style={{
                    fontFamily: "var(--font-ui)",
                    color: linkColor,
                    letterSpacing: "0.08em",
                    textShadow: scrolled ? "none" : "0 1px 8px rgba(0,0,0,0.4)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-6">
            <a
              href={altPath}
              aria-label={UI.switchLangAria}
              className="text-sm tracking-wider transition-colors"
              style={{
                fontFamily: "var(--font-ui)",
                color: linkColor,
                letterSpacing: "0.08em",
                textShadow: scrolled ? "none" : "0 1px 8px rgba(0,0,0,0.4)",
                borderBottom: "1px solid var(--gilt)",
                paddingBottom: "2px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
            >
              {UI.switchLang}
            </a>
            <a href="#kontakt" className="btn btn-primary">
              {UI.orderShort}
            </a>
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={open ? UI.menuClose : UI.menuOpen}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className="block w-6 h-px transition-transform duration-300"
              style={{
                background: open ? "var(--ink)" : barColor,
                transform: open ? "translateY(6px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-6 h-px transition-opacity duration-300"
              style={{
                background: open ? "var(--ink)" : barColor,
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-6 h-px transition-transform duration-300"
              style={{
                background: open ? "var(--ink)" : barColor,
                transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: "rgba(26, 24, 20, 0.4)",
            opacity: open ? 1 : 0,
          }}
          onClick={() => setOpen(false)}
        />
        <nav
          className="absolute top-0 right-0 h-full w-[78%] max-w-sm flex flex-col"
          style={{
            background: "var(--shell)",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.55s var(--ease-curtain)",
            padding: "6rem 2rem 2rem",
            boxShadow: "0 0 60px rgba(0,0,0,0.15)",
          }}
        >
          <ul className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-2xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--sage-deep)",
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#kontakt"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-10 self-start"
          >
            {UI.orderBouquet}
          </a>
          <a
            href={altPath}
            onClick={() => setOpen(false)}
            aria-label={UI.switchLangAria}
            className="mt-8 self-start"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.95rem",
              letterSpacing: "0.08em",
              color: "var(--sage-deep)",
              borderBottom: "1px solid var(--gilt)",
              paddingBottom: "2px",
            }}
          >
            {UI.switchLang}
          </a>
        </nav>
      </div>
    </>
  );
}
