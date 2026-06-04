"use client";

import { useEffect, useRef, useState } from "react";
import { BouquetSVG } from "./BouquetSVG";
import { SEASONS } from "@/lib/constants";

export function Seasons() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIdx = Math.min(
    SEASONS.length - 1,
    Math.floor(progress * SEASONS.length * 0.999)
  );

  return (
    <section
      id="kytice"
      ref={wrapRef}
      style={{
        height: `${SEASONS.length * 95}vh`,
        background: "var(--shell)",
        position: "relative",
      }}
      aria-label="Co u nás najdete — kytice, na míru, příležitosti, dárky"
    >
      <div
        className="sticky top-0 overflow-hidden flex items-center"
        style={{ height: "100vh" }}
      >
        <div className="container w-full">
          <div className="grid grid-cols-1 items-center gap-x-12 gap-y-6 md:grid-cols-2">
            {/* Text column */}
            <div className="relative order-2 md:order-1 min-h-[min(34vh,280px)] md:min-h-[min(60vh,480px)]">
              {SEASONS.map((s, i) => {
                const active = i === activeIdx;
                return (
                  <article
                    key={s.key}
                    aria-hidden={!active}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active
                        ? "translateY(0)"
                        : i < activeIdx
                          ? "translateY(-30px)"
                          : "translateY(30px)",
                      transition:
                        "opacity 0.7s var(--ease-petal), transform 0.7s var(--ease-petal)",
                      pointerEvents: active ? "auto" : "none",
                    }}
                  >
                    <span className="eyebrow">{s.eyebrow}</span>
                    <h2
                      style={{
                        marginTop: "1.2rem",
                        marginBottom: "1.8rem",
                        fontStyle: "italic",
                        fontVariationSettings: '"SOFT" 100, "WONK" 1',
                      }}
                    >
                      {s.title}
                    </h2>
                    <p
                      style={{
                        fontSize: "1.15rem",
                        lineHeight: 1.65,
                        maxWidth: "30em",
                        color: "var(--ink-soft)",
                      }}
                    >
                      {s.body}
                    </p>
                  </article>
                );
              })}
            </div>

            {/* Bouquet column */}
            <div className="relative aspect-square w-full mx-auto order-1 md:order-2 max-w-[260px] md:max-w-[520px]">
              {SEASONS.map((s, i) => {
                const active = i === activeIdx;
                return (
                  <div
                    key={s.key}
                    aria-hidden={!active}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active
                        ? "scale(1) rotate(0deg)"
                        : i < activeIdx
                          ? "scale(0.92) rotate(-4deg)"
                          : "scale(0.92) rotate(4deg)",
                      transition:
                        "opacity 0.8s var(--ease-growth), transform 0.8s var(--ease-growth)",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-[10%] rounded-full"
                      style={{
                        background:
                          "radial-gradient(closest-side, var(--cream), transparent 70%)",
                        opacity: 0.7,
                      }}
                    />
                    <BouquetSVG variant={s.key} className="w-full relative" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress dots */}
          <div
            className="flex items-center justify-center gap-3 mt-8"
            aria-hidden="true"
          >
            {SEASONS.map((_, i) => (
              <span
                key={i}
                style={{
                  height: "2px",
                  width: i === activeIdx ? "48px" : "16px",
                  background:
                    i <= activeIdx ? "var(--sage-deep)" : "var(--stone-pale)",
                  transition: "width 0.5s var(--ease-petal), background 0.5s",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div id="na-miru" style={{ position: "absolute", top: "30%" }} />
      <div id="prilezitosti" style={{ position: "absolute", top: "60%" }} />
    </section>
  );
}
