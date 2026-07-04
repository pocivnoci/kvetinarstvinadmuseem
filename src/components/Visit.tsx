"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { isShopOpen } from "@/lib/hours";

export function Visit({ t }: { t: Dictionary }) {
  const { CONTACT, VISIT, UI } = t;
  const [open, setOpen] = useState(() => isShopOpen(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setOpen(isShopOpen(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const q = encodeURIComponent(SITE.mapsQuery);
  const mapEmbed = `https://maps.google.com/maps?q=${q}&z=16&hl=${t.locale}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  return (
    <section
      id="kontakt"
      style={{
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-6)",
        background: "var(--shell)",
      }}
      aria-label={UI.visitAria}
    >
      <div className="container">
        <div className="text-center mb-14">
          <span className="eyebrow">{VISIT.eyebrow}</span>
          <h2 style={{ marginTop: "1rem" }}>{VISIT.title}</h2>
        </div>

        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            borderTop: "1px solid var(--sage)",
            borderBottom: "1px solid var(--sage)",
            padding: "var(--space-4) 0",
          }}
        >
          {/* Address */}
          <VisitColumn heading={UI.visitWhere}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.4rem",
                color: "var(--ink)",
                marginBottom: "0.6rem",
              }}
            >
              {CONTACT.address}
            </p>
            <p style={{ color: "var(--ink-soft)" }}>
              {CONTACT.postal} {CONTACT.city}
            </p>
            <p
              style={{
                color: "var(--gilt-deep)",
                fontSize: "0.9rem",
                marginTop: "0.6rem",
              }}
            >
              {CONTACT.nearestStop}
            </p>
          </VisitColumn>

          {/* Hours */}
          <VisitColumn heading={UI.visitOpen}>
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: "0.8rem" }}
            >
              <span
                className={open ? "open-dot" : "closed-dot"}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: open ? "var(--sage-deep)" : "var(--stone)",
                }}
              >
                {open ? UI.visitOpenNow : UI.visitClosedNow}
              </span>
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                fontFamily: "var(--font-ui)",
                fontSize: "0.95rem",
                color: "var(--ink-soft)",
                lineHeight: 1.9,
              }}
            >
              <li style={{ whiteSpace: "pre" }}>{CONTACT.hours.weekdays}</li>
              <li style={{ whiteSpace: "pre" }}>{CONTACT.hours.weekend}</li>
            </ul>
          </VisitColumn>

          {/* Contact */}
          <VisitColumn heading={UI.visitWrite}>
            <a
              href={CONTACT.phoneHref}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.3rem",
                color: "var(--ink)",
                marginBottom: "0.6rem",
                borderBottom: "1px solid var(--gilt)",
                paddingBottom: "0.2rem",
                width: "fit-content",
              }}
            >
              {CONTACT.phone}
            </a>
            <a
              href={CONTACT.emailHref}
              style={{
                display: "block",
                color: "var(--ink-soft)",
                marginBottom: "0.6rem",
                borderBottom: "1px solid transparent",
                width: "fit-content",
              }}
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                color: "var(--sage-deep)",
              }}
            >
              {CONTACT.instagram} →
            </a>
          </VisitColumn>
        </div>

        {/* Mapa — keyless Google embed (bez API klíče / billingu) */}
        <div
          className="mt-12"
          style={{
            position: "relative",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid rgba(184, 146, 77, 0.3)",
            boxShadow: "0 18px 44px -26px rgba(26, 24, 20, 0.5)",
            background: "var(--sage-pale)",
          }}
        >
          <iframe
            title={UI.mapTitle}
            aria-label={UI.mapTitle}
            src={mapEmbed}
            width="100%"
            height="400"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
          <a href={CONTACT.phoneHref} className="btn btn-primary">
            {UI.visitConsult}
            <span aria-hidden="true">→</span>
          </a>
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {UI.getDirections}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function VisitColumn({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="eyebrow"
        style={{ marginBottom: "1.2rem" }}
      >
        {heading}
      </div>
      {children}
    </div>
  );
}
