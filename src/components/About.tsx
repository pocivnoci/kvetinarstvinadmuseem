"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ABOUT } from "@/lib/constants";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="o-nas"
      style={{
        paddingTop: "var(--space-7)",
        paddingBottom: "var(--space-7)",
        background: "var(--cream)",
        position: "relative",
      }}
      aria-label="O nás"
    >
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-x-14 gap-y-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Image */}
          <figure
            className="relative aspect-[4/5] overflow-hidden"
            style={{
              background: "var(--sage-pale)",
              borderRadius: "4px",
              maxWidth: "440px",
            }}
          >
            <Image
              src={ABOUT.image.src}
              alt={ABOUT.image.alt}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
            {/* Gilt corner frame */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                right: "8px",
                bottom: "8px",
                border: "1px solid rgba(212, 177, 117, 0.55)",
                pointerEvents: "none",
              }}
            />
          </figure>

          {/* Editorial column */}
          <div ref={ref}>
            <div
              className={`stem-grow flex items-start gap-4 ${inView ? "in-view" : ""}`}
              style={{ marginBottom: "1.5rem" }}
            >
              <svg
                width="10"
                height="100"
                viewBox="0 0 10 100"
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: "4px" }}
              >
                <path
                  d="M 5 100 Q 6 60 5 0"
                  stroke="var(--sage-deep)"
                  strokeWidth="1.6"
                  fill="none"
                  pathLength="1"
                />
                <ellipse cx="5" cy="3" rx="3" ry="2" fill="var(--sage-deep)" />
              </svg>
              <div>
                <span className="eyebrow">{ABOUT.eyebrow}</span>
                <h2 style={{ marginTop: "0.8rem" }}>{ABOUT.title}</h2>
              </div>
            </div>

            {ABOUT.body.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  color: "var(--ink-soft)",
                  marginBottom: "1.4rem",
                  maxWidth: "32em",
                }}
              >
                {paragraph}
              </p>
            ))}

            {/* Pull quote */}
            <blockquote
              style={{
                marginTop: "2.5rem",
                paddingLeft: "1.5rem",
                borderLeft: "2px solid var(--gilt)",
                maxWidth: "30em",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                  lineHeight: 1.3,
                  color: "var(--sage-deep)",
                  fontVariationSettings: '"SOFT" 100, "WONK" 1',
                  marginBottom: "0.8rem",
                }}
              >
                „{ABOUT.pullQuote}"
              </p>
              <cite
                className="eyebrow"
                style={{
                  fontStyle: "normal",
                  color: "var(--ink-soft)",
                }}
              >
                {ABOUT.pullQuoteBy}
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
