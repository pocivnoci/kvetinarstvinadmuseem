"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export function Footer({ t }: { t: Dictionary }) {
  const { CONTACT, FOOTER, SHOP, UI } = t;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sent");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <footer
      style={{
        background: "var(--noir)",
        color: "var(--stone-pale)",
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-3)",
        position: "relative",
      }}
    >
      {/* Top hairline */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, var(--gilt) 50%, transparent)",
          opacity: 0.5,
        }}
      />

      <div className="container">
        <div
          className="grid gap-10 mb-14"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt={SHOP.name}
              className="h-12 w-auto"
              style={{ filter: "invert(1)", marginBottom: "1.2rem" }}
            />
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--stone-pale)",
                opacity: 0.75,
                lineHeight: 1.6,
                maxWidth: "26em",
              }}
            >
              {FOOTER.blurb}
            </p>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow"
              style={{
                color: "var(--gilt-light)",
                marginTop: "1.4rem",
              }}
            >
              {CONTACT.instagram}
            </a>
          </div>

          {/* Link columns */}
          {FOOTER.columns.map((col) => (
            <div key={col.heading}>
              <div
                className="eyebrow"
                style={{ color: "var(--gilt-light)", marginBottom: "1.2rem" }}
              >
                {col.heading}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7rem",
                }}
              >
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--stone-pale)",
                        transition: "color 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--cream)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--stone-pale)")
                      }
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div style={{ minWidth: 0 }}>
            <div
              className="eyebrow"
              style={{ color: "var(--gilt-light)", marginBottom: "1rem" }}
            >
              {FOOTER.newsletter.heading}
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--stone-pale)",
                opacity: 0.75,
                lineHeight: 1.55,
                marginBottom: "1.2rem",
              }}
            >
              {FOOTER.newsletter.body}
            </p>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                {UI.footerEmailLabel}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder={FOOTER.newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--stone)",
                  padding: "0.6rem 0",
                  color: "var(--cream)",
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                className="btn"
                style={{
                  alignSelf: "flex-start",
                  background: "var(--cream)",
                  color: "var(--noir)",
                  padding: "0.7rem 1.4rem",
                }}
              >
                {status === "sent" ? UI.footerThanks : FOOTER.newsletter.cta}
              </button>
            </form>
          </div>
        </div>

        {/* Legal strip */}
        <div
          className="flex flex-wrap items-center justify-between gap-4"
          style={{
            borderTop: "1px solid rgba(200, 194, 182, 0.15)",
            paddingTop: "1.5rem",
            fontFamily: "var(--font-ui)",
            fontSize: "0.78rem",
            color: "var(--stone)",
            letterSpacing: "0.04em",
          }}
        >
          <span>{FOOTER.legal}</span>
          <span>
            {CONTACT.address} · {CONTACT.city}
          </span>
        </div>
      </div>
    </footer>
  );
}
