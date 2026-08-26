"use client";

import { useCallback, useEffect, useState } from "react";
import type { OdkazSrc } from "@/lib/odkazy-utm";

/**
 * Měření pro /odkazy — Meta Pixel + delegované sledování kliků.
 *
 * Na webu neběží žádná consent platforma ani jiné analytics, takže si souhlas
 * řeší tahle stránka sama: pixel se nenačte dřív, než návštěvník klikne na
 * „Souhlasím“. Do té doby (a po odmítnutí) se nenačítá žádný skript třetí
 * strany a neposílá se nikam nic.
 *
 * Volba se ukládá do localStorage. Samotný záznam o souhlasu je podle ePrivacy
 * „nezbytně nutné“ úložiště — bez něj by se lišta ptala při každém načtení.
 *
 * Kliky se odchytávají delegovaně na document, ne přes onClick na odkazech.
 * Odkazy tak zůstávají obyčejné serverové <a> a stránka funguje i bez JS.
 */

const STORAGE_KEY = "kvm-souhlas-mereni";

type Consent = "granted" | "denied";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  push?: unknown;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: unknown;
  }
}

function readConsent(): Consent | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Safari v privátním režimu umí na localStorage hodit výjimku.
    return null;
  }
}

function writeConsent(value: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* prázdné — bez uložení se lišta příště zeptá znovu, nic se nerozbije */
  }
}

/** Oficiální bootstrap Meta Pixelu, přepsaný do čitelné podoby. */
function loadPixel(pixelId: string) {
  if (window.fbq) return;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue.push(args);
  } as Fbq;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;

  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
}

export function OdkazyTracking({
  pixelId,
  src,
}: {
  /** Prázdné = pixel se prostě nenačte a nic se nerozbije. */
  pixelId?: string;
  src: OdkazSrc | null;
}) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    setResolved(true);
  }, []);

  // Pixel se aktivuje jen se souhlasem a jen když je nastavené ID.
  useEffect(() => {
    if (consent !== "granted" || !pixelId) return;
    loadPixel(pixelId);
    // Zobrazení stránky s informací, z jakého nosiče člověk přišel.
    window.fbq?.("trackCustom", "OdkazyZobrazeni", { src: src ?? "primo" });
  }, [consent, pixelId, src]);

  // Delegovaný klik — jeden listener pro všechny odkazy v seznamu.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[data-odkaz-id]") as
        | HTMLAnchorElement
        | null;
      if (!anchor || !window.fbq) return;

      const id = anchor.dataset.odkazId;
      if (!id) return;

      window.fbq("trackCustom", `Odkaz_${id}`, {
        odkaz: id,
        label: anchor.dataset.odkazLabel ?? id,
        src: src ?? "primo",
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [src]);

  const decide = useCallback((value: Consent) => {
    writeConsent(value);
    setConsent(value);
  }, []);

  // Lištu ukazujeme jen když je co měřit a člověk se ještě nerozhodl.
  if (!pixelId || !resolved || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Souhlas s měřením"
      style={{
        position: "fixed",
        left: "0.75rem",
        right: "0.75rem",
        bottom: "0.75rem",
        zIndex: 20,
        margin: "0 auto",
        maxWidth: "30rem",
        background: "var(--cream)",
        border: "1px solid var(--noir)",
        borderRadius: "3px",
        padding: "0.9rem 1rem",
        boxShadow:
          "1px 1px 0 rgba(26,24,20,0.1), 2px 2px 0 rgba(26,24,20,0.08), 3px 3px 0 rgba(26,24,20,0.06)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-body), Georgia, serif",
          fontSize: "0.85rem",
          lineHeight: 1.45,
          color: "var(--ink)",
          marginBottom: "0.75rem",
        }}
      >
        Můžeme měřit, které odkazy vás zajímají? Pomůže nám to zjistit, odkud
        k nám lidé chodí. Bez souhlasu stránka funguje úplně stejně.
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => decide("granted")}
          style={{
            flex: 1,
            minHeight: "44px",
            background: "var(--sage-cta, #5f6c47)",
            color: "var(--cream)",
            borderRadius: "3px",
            fontFamily: "var(--font-ui), sans-serif",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Souhlasím
        </button>
        <button
          type="button"
          onClick={() => decide("denied")}
          style={{
            flex: 1,
            minHeight: "44px",
            background: "transparent",
            color: "var(--ink)",
            border: "1px solid rgba(26,24,20,0.35)",
            borderRadius: "3px",
            fontFamily: "var(--font-ui), sans-serif",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Ne, děkuji
        </button>
      </div>
    </div>
  );
}
