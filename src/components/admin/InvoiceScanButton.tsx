"use client";

import { useRef, useState } from "react";
import type { InvoiceScan } from "@/lib/admin/types";
import { Ico } from "./icons";

/** Fotky z mobilu mají klidně 10 MB — na přečtení stačí delší strana 2000 px. */
const MAX_SIDE = 2000;

async function shrinkImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 3 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    // HEIC a podobné prohlížeč neumí — pošleme originál, server řekne, co s ním.
    return file;
  }
}

/**
 * Tlačítko „Načíst z dokladu": vyfotit nebo vybrat fakturu (fotka / PDF),
 * nechat ji přečíst na serveru a předat údaje formuláři ke kontrole.
 */
export function InvoiceScanButton({ onScanned }: { onScanned: (scan: InvoiceScan) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function read(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      const blob = await shrinkImage(file);
      body.append("file", blob, blob === file ? file.name : "faktura.jpg");
      const res = await fetch("/api/admin/faktura", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { scan?: InvoiceScan; error?: string };
      if (!res.ok || !json.scan) throw new Error(json.error ?? "Doklad se nepodařilo přečíst.");
      onScanned(json.scan);
    } catch (e) {
      setError(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Bez spojení se server nedá doklad přečíst.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*,application/pdf"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void read(f);
        }}
      />
      <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => input.current?.click()}>
        <Ico.scan className="" /> {busy ? "Čtu doklad…" : "Načíst z fotky / PDF"}
      </button>
      {error && (
        <p className="notice notice-danger" role="alert" style={{ flexBasis: "100%", margin: 0 }}>
          {error}
        </p>
      )}
    </>
  );
}
