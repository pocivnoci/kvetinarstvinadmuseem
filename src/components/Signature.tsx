"use client";

import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n";

type Card = Dictionary["SIGNATURE"]["cards"][number];

export function Signature({ t }: { t: Dictionary }) {
  const { SIGNATURE, UI } = t;
  return (
    <section
      style={{
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-6)",
        background: "var(--cream)",
      }}
      aria-label={SIGNATURE.title}
    >
      <div className="container">
        <div className="grid grid-cols-1 items-end gap-8 mb-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div>
            <span className="eyebrow">{SIGNATURE.eyebrow}</span>
            <h2 style={{ marginTop: "1rem" }}>{SIGNATURE.title}</h2>
          </div>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--ink-soft)",
              lineHeight: 1.6,
              maxWidth: "34em",
            }}
          >
            {SIGNATURE.body}
          </p>
        </div>

        <div
          className="grid gap-6 md:gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {SIGNATURE.cards.map((card, i) => (
            <SignatureCard
              key={card.title}
              card={card}
              index={i}
              total={SIGNATURE.cards.length}
              priceFromLabel={UI.priceFrom}
              orderLabel={UI.orderShort}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SignatureCard({
  card,
  index,
  total,
  priceFromLabel,
  orderLabel,
}: {
  card: Card;
  index: number;
  total: number;
  priceFromLabel: string;
  orderLabel: string;
}) {
  const ref = useRef<HTMLElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelector(".card-inner") as HTMLElement | null;
    if (!inner) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    inner.style.setProperty("--ry", `${x * 8}deg`);
    inner.style.setProperty("--rx", `${-y * 8}deg`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelector(".card-inner") as HTMLElement | null;
    if (!inner) return;
    inner.style.setProperty("--ry", "0deg");
    inner.style.setProperty("--rx", "0deg");
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        perspective: "1200px",
        position: "relative",
      }}
    >
      <div
        className="card-inner"
        style={
          {
            position: "relative",
            background: "var(--shell)",
            borderRadius: "14px",
            padding: "2.4rem 2rem 2rem",
            transform: "rotateX(var(--rx, 0)) rotateY(var(--ry, 0))",
            transformStyle: "preserve-3d",
            transition: "transform 0.5s var(--ease-petal)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.5) inset, 0 14px 40px -22px rgba(26, 24, 20, 0.4), 0 2px 10px -6px rgba(26, 24, 20, 0.15)",
            border: "1px solid rgba(184, 146, 77, 0.12)",
            minHeight: "320px",
            display: "flex",
            flexDirection: "column",
            "--rx": "0deg",
            "--ry": "0deg",
          } as React.CSSProperties
        }
      >
        {/* Accent bar */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "2rem",
            right: "2rem",
            height: "4px",
            background: card.accent,
            borderRadius: "0 0 4px 4px",
            transform: "translateZ(40px)",
          }}
        />
        {/* Number */}
        <div
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: "var(--gilt-deep)",
            marginBottom: "0.6rem",
            transform: "translateZ(30px)",
          }}
        >
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </div>
        <h3
          style={{
            fontSize: "1.8rem",
            marginBottom: "0.4rem",
            transform: "translateZ(50px)",
          }}
        >
          {card.title}
        </h3>
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.78rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--sage-deep)",
            marginBottom: "1.2rem",
            transform: "translateZ(30px)",
          }}
        >
          {card.subtitle}
        </div>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--ink-soft)",
            flexGrow: 1,
            transform: "translateZ(20px)",
          }}
        >
          {card.body}
        </p>
        <div
          className="flex items-baseline justify-between mt-6 pt-5"
          style={{
            borderTop: "1px solid rgba(109, 122, 82, 0.18)",
            transform: "translateZ(30px)",
          }}
        >
          <div>
            {/^\d/.test(card.priceFrom) && (
              <div
                className="eyebrow"
                style={{ fontSize: "0.65rem", marginBottom: "0.25rem" }}
              >
                {priceFromLabel}
              </div>
            )}
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.3rem",
                color: "var(--ink)",
              }}
            >
              {card.priceFrom}
            </div>
          </div>
          <a
            href="#kontakt"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--sage-deep)",
              borderBottom: "1px solid var(--gilt)",
              paddingBottom: "2px",
            }}
          >
            {orderLabel} →
          </a>
        </div>
      </div>
    </article>
  );
}
