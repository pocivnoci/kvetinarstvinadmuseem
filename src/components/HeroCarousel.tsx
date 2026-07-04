"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export function HeroCarousel({ t }: { t: Dictionary }) {
  const { HERO, UI } = t;
  const slides = HERO.slides;
  const track = [...slides, ...slides];
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      aria-label={UI.heroSection}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "min(100svh, 920px)", background: "var(--noir)" }}
    >
      {/* Background — continuous marquee of shop photos */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="hero-marquee-track flex h-full"
          style={{ width: "max-content" }}
        >
          {track.map((slide, i) => (
            <div
              key={`${slide.src}-${i}`}
              className="relative h-full flex-shrink-0"
              style={{ width: "min(46vw, 520px)", marginRight: "0.75rem" }}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                priority={i < 2}
                sizes="520px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark wash so foreground reads clearly */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(92deg, rgba(26,24,20,0.86) 0%, rgba(26,24,20,0.68) 42%, rgba(26,24,20,0.32) 72%, rgba(26,24,20,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative" style={{ minHeight: "min(100svh, 920px)" }}>
        <div
          className="container h-full flex items-center"
          style={{ minHeight: "min(100svh, 920px)", paddingTop: "6rem", paddingBottom: "4rem" }}
        >
          <div
            style={{
              maxWidth: "40rem",
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(24px)",
              transition:
                "opacity 1.2s var(--ease-growth), transform 1.2s var(--ease-growth)",
            }}
          >
            <span className="eyebrow" style={{ color: "var(--gilt-light)" }}>
              {HERO.eyebrow}
            </span>
            <h1
              style={{
                color: "var(--cream)",
                marginTop: "1.4rem",
                marginBottom: "1.6rem",
                fontSize: "clamp(3rem, 7.5vw, 6.4rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
                textShadow: "0 2px 40px rgba(0,0,0,0.45)",
              }}
            >
              Květiny
              <br />
              <span style={{ fontStyle: "italic", color: "var(--cream)" }}>
                nad&nbsp;museem
              </span>
              <span style={{ color: "var(--gilt-light)" }}>.</span>
            </h1>
            <p
              style={{
                color: "var(--cream)",
                fontSize: "clamp(1.05rem, 1.4vw, 1.3rem)",
                lineHeight: 1.55,
                maxWidth: "30em",
                marginBottom: "2.2rem",
                opacity: 0.94,
                textShadow: "0 1px 18px rgba(0,0,0,0.55)",
              }}
            >
              {HERO.lede}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={HERO.ctaPrimary.href} className="btn btn-cream">
                {HERO.ctaPrimary.label}
                <span aria-hidden="true">→</span>
              </a>
              <a
                href={HERO.ctaGhost.href}
                className="btn"
                style={{
                  border: "1px solid rgba(244,237,224,0.6)",
                  color: "var(--cream)",
                }}
              >
                {HERO.ctaGhost.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
