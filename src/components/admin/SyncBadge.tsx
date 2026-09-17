"use client";

import { useAdmin } from "@/lib/admin/store";

/**
 * Kde právě žijí data. Floristka nemá řešit techniku, ale musí poznat,
 * když se něco neuložilo — proto je stav vidět pořád, ne jen při chybě.
 */
export function SyncBadge({ compact = false }: { compact?: boolean }) {
  const { ready, mode, status, syncedAt, unsaved, error } = useAdmin();
  if (!ready) return null;

  const view = (() => {
    if (mode === "local") {
      return { tone: "var(--stone)", label: "Jen tento prohlížeč", detail: "Data se neukládají do databáze." };
    }
    switch (status) {
      case "saving":
        return { tone: "var(--gilt)", label: "Ukládám…", detail: "Posílám změny do databáze." };
      case "conflict":
        return { tone: "var(--gilt)", label: "Slaďuji…", detail: "Někdo ukládal z druhého zařízení, spojuji změny." };
      case "offline":
        return {
          tone: "var(--terracotta)",
          label: "Bez připojení",
          detail: `Změny jsou zatím jen tady${unsaved ? ` (${unsaved})` : ""}. Odešlou se, až bude signál.`,
        };
      case "error":
        return { tone: "var(--terracotta)", label: "Neuloženo", detail: "Uložení se nepovedlo. Podrobnosti jsou v Nastavení." };
      default:
        return {
          tone: "var(--sage-deep)",
          label: "Uloženo v databázi",
          detail: syncedAt ? `Naposledy ${new Date(syncedAt).toLocaleTimeString("cs-CZ")}.` : "Data jsou na všech zařízeních stejná.",
        };
    }
  })();

  return (
    <span
      className={`sync ${compact ? "sync--compact" : ""}`}
      title={error ? `${view.detail}\n\n${error}` : view.detail}
    >
      <i style={{ background: view.tone }} />
      <span>{view.label}</span>
    </span>
  );
}
