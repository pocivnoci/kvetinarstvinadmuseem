"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Přihlášení se nepovedlo.");
        return;
      }
      const next = params.get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Nepodařilo se spojit se serverem.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card stack" style={{ width: "min(24rem, 100%)" }}>
      <div style={{ textAlign: "center", paddingBottom: "0.5rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Květiny nad museem" style={{ height: "3.5rem", margin: "0 auto 0.75rem" }} />
        <h1 style={{ fontSize: "1.5rem" }}>
          Vstup pro <em>floristku</em>
        </h1>
      </div>
      <label className="field">
        <span className="field-label">Heslo</span>
        <input
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <div className="notice notice-danger" style={{ margin: 0 }}>{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={busy} style={{ justifyContent: "center" }}>
        {busy ? "Ověřuji…" : "Přihlásit"}
      </button>
      <a href="/" className="small muted" style={{ textAlign: "center" }}>
        ← zpět na web
      </a>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div
      className="admin"
      style={{ display: "grid", placeItems: "center", padding: "1.5rem", gridTemplateColumns: "1fr" }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
