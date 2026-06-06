"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export function Gallery({ t }: { t: Dictionary }) {
  const { GALLERY, UI } = t;
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragging = useRef(false);
  const dragMoved = useRef(false);
  const start = useRef({ x: 0, scroll: 0 });
  const count = GALLERY.slides.length;

  // Measure one slide step (slide width + gap)
  const stepSize = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const first = track.children[0] as HTMLElement | undefined;
    const second = track.children[1] as HTMLElement | undefined;
    if (!first) return 0;
    if (second) return second.offsetLeft - first.offsetLeft;
    return first.offsetWidth;
  }, []);

  const goTo = useCallback(
    (index: number, smooth = true) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(count - 1, index));
      track.scrollTo({
        left: clamped * stepSize(),
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [count, stepSize]
  );

  // Track scroll → active index
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const step = stepSize();
        if (step > 0) setActive(Math.round(track.scrollLeft / step));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [stepSize]);

  // Gentle autoplay — pauses on interaction, respects reduced motion
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const next = active >= count - 1 ? 0 : active + 1;
      goTo(next);
    }, 4500);
    return () => window.clearInterval(id);
  }, [active, count, paused, goTo]);

  // Pointer drag-to-scroll
  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    dragging.current = true;
    dragMoved.current = false;
    start.current = { x: e.clientX, scroll: track.scrollLeft };
    track.style.scrollSnapType = "none";
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 4) dragMoved.current = true;
    track.scrollLeft = start.current.scroll - dx;
  };

  const endDrag = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || !dragging.current) return;
    dragging.current = false;
    track.style.scrollSnapType = "";
    try {
      track.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    const step = stepSize();
    if (step > 0) goTo(Math.round(track.scrollLeft / step));
  };

  return (
    <section
      id="galerie"
      aria-label={GALLERY.title}
      style={{
        paddingTop: "var(--space-6)",
        paddingBottom: "var(--space-6)",
        background: "var(--shell)",
        overflow: "hidden",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow">{GALLERY.eyebrow}</span>
            <h2 style={{ marginTop: "1rem" }}>{GALLERY.title}</h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--ink-soft)",
                lineHeight: 1.6,
                maxWidth: "36em",
                marginTop: "1rem",
              }}
            >
              {GALLERY.body}
            </p>
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-3">
            <CarouselButton
              label={UI.galleryPrev}
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              dir="prev"
            />
            <CarouselButton
              label={UI.galleryNext}
              onClick={() => goTo(active + 1)}
              disabled={active === count - 1}
              dir="next"
            />
          </div>
        </div>
      </div>

      {/* Track — bleeds to the right edge, peeking next slide */}
      <ul
        ref={trackRef}
        className="carousel-track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ listStyle: "none", margin: 0 }}
      >
        {GALLERY.slides.map((slide, i) => (
          <li
            key={slide.src}
            className="carousel-slide"
            aria-roledescription="slide"
            aria-label={`${i + 1} ${UI.galleryOf} ${count}`}
          >
            <figure
              className="relative w-full h-full overflow-hidden"
              style={{ background: slide.tone, borderRadius: "10px" }}
              onClickCapture={(e) => {
                // Suppress accidental click after a drag
                if (dragMoved.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 768px) 420px, 80vw"
                className="object-cover select-none pointer-events-none"
                draggable={false}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 45%, rgba(26,24,20,0.55) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
              <figcaption
                style={{
                  position: "absolute",
                  left: "1rem",
                  bottom: "1rem",
                  right: "1rem",
                  color: "var(--cream)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "1.25rem",
                  textShadow: "0 1px 6px rgba(0,0,0,0.35)",
                }}
              >
                {slide.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {/* Dots */}
      <div className="container">
        <div className="flex items-center justify-between gap-4 mt-8">
          <div className="flex items-center gap-2" role="tablist" aria-label={UI.slides}>
            {GALLERY.slides.map((slide, i) => (
              <button
                key={slide.src}
                role="tab"
                aria-selected={i === active}
                aria-label={`${UI.galleryGoTo} ${slide.caption}`}
                onClick={() => goTo(i)}
                style={{
                  height: "8px",
                  width: i === active ? "30px" : "8px",
                  borderRadius: "999px",
                  background:
                    i === active ? "var(--sage-deep)" : "var(--stone-pale)",
                  transition:
                    "width 0.5s var(--ease-petal), background 0.4s var(--ease-petal)",
                }}
              />
            ))}
          </div>
          <span
            className="eyebrow"
            style={{ fontSize: "0.65rem", opacity: 0.7 }}
          >
            {GALLERY.hint}
          </span>
        </div>
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  disabled,
  dir,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  dir: "prev" | "next";
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "999px",
        border: "1px solid var(--sage-deep)",
        color: "var(--sage-deep)",
        display: "grid",
        placeItems: "center",
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? "default" : "pointer",
        transition: "background 0.4s var(--ease-petal), color 0.4s, opacity 0.4s",
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = "var(--sage-deep)";
        e.currentTarget.style.color = "var(--cream)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--sage-deep)";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={dir === "prev" ? "M15 4 L7 12 L15 20" : "M9 4 L17 12 L9 20"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
