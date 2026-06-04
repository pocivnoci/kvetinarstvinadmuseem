"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO } from "@/lib/constants";

const DURATION = 5500;

export function HeroCarousel() {
  const slides = HERO.slides;
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const t = setTimeout(() => setEntered(true), 80);
    if (reduced.current && videoRef.current) videoRef.current.pause();
    return () => clearTimeout(t);
  }, []);

  const go = useCallback(
    (i: number) => setActive((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || reduced.current) return;
    const id = window.setTimeout(() => go(active + 1), DURATION);
    return () => window.clearTimeout(id);
  }, [active, paused, go]);

  return (
    <section
      aria-label="Úvod — rodinné květinářství Květiny nad museem"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "min(100svh, 920px)", background: "var(--noir)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background — crossfading flower photos */}
      {slides.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.src}
            aria-hidden={!isActive}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity 1.3s var(--ease-growth)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform:
                  isActive && !reduced.current ? "scale(1.08)" : "scale(1)",
                transition: isActive
                  ? `transform ${DURATION + 1500}ms linear`
                  : "none",
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        );
      })}

      {/* Dark wash so foreground reads clearly */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(92deg, rgba(26,24,20,0.82) 0%, rgba(26,24,20,0.55) 42%, rgba(26,24,20,0.25) 72%, rgba(26,24,20,0.5) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative" style={{ minHeight: "min(100svh, 920px)" }}>
        <div
          className="container h-full flex items-center"
          style={{ minHeight: "min(100svh, 920px)", paddingTop: "6rem", paddingBottom: "4rem" }}
        >
          <div
            className="grid items-center gap-10 w-full md:grid-cols-[1.15fr_minmax(0,0.85fr)]"
          >
            {/* Copy */}
            <div
              style={{
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

            {/* Live video card */}
            <div
              className="hidden sm:flex justify-center md:justify-end"
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(30px)",
                transition:
                  "opacity 1.4s var(--ease-growth) 0.2s, transform 1.4s var(--ease-growth) 0.2s",
              }}
            >
              <figure
                className="relative"
                style={{
                  width: "min(360px, 80%)",
                  aspectRatio: "464 / 832",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow:
                    "0 30px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,177,117,0.5)",
                  margin: 0,
                }}
              >
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={HERO.video.mp4}
                  poster={HERO.video.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Záběr z dílny — čerstvé květiny"
                />
                {/* gilt inner frame */}
                <span
                  aria-hidden="true"
                  className="absolute"
                  style={{
                    inset: "8px",
                    border: "1px solid rgba(244,237,224,0.45)",
                    borderRadius: "8px",
                    pointerEvents: "none",
                  }}
                />
                {/* live label */}
                <figcaption
                  className="absolute flex items-center gap-2"
                  style={{
                    left: "14px",
                    bottom: "14px",
                    fontFamily: "var(--font-ui)",
                    fontSize: "0.66rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--cream)",
                    textShadow: "0 1px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  <span className="open-dot" style={{ background: "var(--cream)" }} />
                  {HERO.video.label}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* Progress bars */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container">
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Snímky"
              style={{ paddingBottom: "1.6rem" }}
            >
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={slide.caption}
                  onClick={() => go(i)}
                  style={{
                    width: "40px",
                    height: "16px",
                    display: "grid",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      height: "2px",
                      width: "100%",
                      background: "rgba(244,237,224,0.35)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      key={`${active}-${i}`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "var(--cream)",
                        transformOrigin: "left",
                        transform:
                          i <= active ? "scaleX(1)" : "scaleX(0)",
                        animation:
                          i === active && !paused && !reduced.current
                            ? `hero-progress ${DURATION}ms linear`
                            : "none",
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hero-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
