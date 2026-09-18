"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { neodeslaneZmeny, useAdmin, zapomenoutNeodeslane, type Neodeslane } from "@/lib/admin/store";
import { parseNumber } from "@/lib/admin/format";
import { ukazkovaData } from "@/lib/admin/ukazka";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/admin/types";
import { Card, Field, Loading, PageHead } from "@/components/admin/ui";

export default function NastaveniPage() {
  const { doc, ready, loaded, mode, status, syncedAt, unsaved, error, update, replace, flush, reload } = useAdmin();
  const [msg, setMsg] = useState<{ tone: "ok" | "danger"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  // Úpravy, které se do databáze nedostaly a přežily zavření záložky.
  const [neodeslane, setNeodeslane] = useState<Neodeslane | null>(null);
  useEffect(() => setNeodeslane(neodeslaneZmeny()), [status]);

  if (!ready) return <Loading />;

  function exportJson() {
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kvetiny-admin-zaloha-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ tone: "ok", text: "Záloha se stahuje. Uložte ji někam bezpečně (Google Drive, e-mail sobě)." });
  }

  async function importJson(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.orders)) throw new Error("bad");
      if (!window.confirm("Nahradit všechna současná data obsahem zálohy?")) return;
      replace(parsed);
      setMsg({ tone: "ok", text: `Záloha načtena: ${parsed.orders.length} objednávek, ${parsed.customers?.length ?? 0} zákazníků, ${parsed.stock?.length ?? 0} položek skladu.` });
    } catch {
      setMsg({ tone: "danger", text: "Soubor se nepodařilo načíst — není to záloha z tohoto adminu." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function loadSample() {
    const hasData = doc.orders.length || doc.customers.length || doc.stock.length;
    if (hasData && !window.confirm("Ukázková data nahradí vše, co teď v adminu je. Pokračovat?")) return;
    replace(ukazkovaData());
    setMsg({ tone: "ok", text: "Ukázková data načtena. Až budete chtít začít naostro, smažte je tlačítkem níže." });
  }

  function wipe() {
    if (!window.confirm("Opravdu smazat VŠECHNA data adminu v tomto prohlížeči? Nejde to vrátit.")) return;
    if (!window.confirm("Máte zálohu? Tohle je poslední varování.")) return;
    replace({});
    setMsg({ tone: "ok", text: "Admin je prázdný." });
  }

  return (
    <>
      <PageHead title="Nastavení" sub="Výchozí hodnoty pro kalkulačku, záloha dat a informace o přihlášení." />

      {msg && <div className={`notice notice-${msg.tone}`}>{msg.text}</div>}

      <div className="grid-2">
        <SettingsForm settings={doc.settings} onSave={(s) => { update((d) => ({ ...d, settings: s })); setMsg({ tone: "ok", text: "Nastavení uloženo." }); }} />

        <div className="stack">
          <Card title="Kde jsou data">
            {mode === "cloud" ? (
              <p className="small" style={{ fontFamily: "var(--font-body)", marginBottom: "0.9rem" }}>
                Data jsou v <strong>databázi</strong>, takže je vidíte stejně na mobilu i na počítači
                v krámu. Prohlížeč si drží kopii pro případ, že vypadne internet — co zadáte bez
                signálu, se odešle, jakmile se připojení vrátí.
              </p>
            ) : (
              <p className="small" style={{ fontFamily: "var(--font-body)", marginBottom: "0.9rem" }}>
                Databáze zatím není nastavená, takže data žijí <strong>jen v tomto prohlížeči</strong>.
                Vymazání historie prohlížeče je smaže a v jiném telefonu ani počítači nebudou.
                Zálohujte si je pravidelně — třeba každý pátek.
              </p>
            )}
            <dl className="kv small" style={{ marginBottom: "1rem" }}>
              <dt>Stav</dt>
              <dd>
                {mode === "local" && "Jen tento prohlížeč"}
                {mode === "cloud" && status === "offline" && `Bez připojení${unsaved ? ` · ${unsaved} neuložených změn` : ""}`}
                {mode === "cloud" && status === "error" && "Uložení se nepovedlo"}
                {mode === "cloud" && (status === "ready" || status === "saving" || status === "conflict" || status === "loading") &&
                  `Databáze${syncedAt ? ` · naposledy uloženo ${new Date(syncedAt).toLocaleTimeString("cs-CZ")}` : ""}`}
              </dd>
            </dl>
            {mode === "cloud" && (status === "error" || status === "offline") && (
              <div className="notice notice-danger" style={{ marginBottom: "1rem" }}>
                <strong>Databáze neodpovídá.</strong> Data se zatím ukládají jen do tohoto
                prohlížeče a odešlou se, jakmile spojení začne fungovat.
                {error && (
                  <>
                    <br />
                    <span className="field-label" style={{ display: "block", marginTop: "0.6rem" }}>
                      Hlášení serveru
                    </span>
                    <code
                      style={{
                        display: "block",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontSize: "0.78rem",
                        marginTop: "0.2rem",
                      }}
                    >
                      {error}
                    </code>
                  </>
                )}
              </div>
            )}
            {mode === "cloud" && (
              <div className="row" style={{ marginBottom: "1rem" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => void reload()}>
                  Zkusit spojení znovu
                </button>
                {unsaved > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={() => void flush()}>
                    Uložit teď ({unsaved})
                  </button>
                )}
              </div>
            )}
          </Card>

          {neodeslane && (
            <Card title="Neodeslané změny">
              <div className="notice notice-warn" style={{ marginBottom: "1rem" }}>
                <strong>Něco se do databáze nedostalo.</strong> Když databáze neodpovídá, admin do ní
                schválně nezapisuje, aby nepřepsal, co v ní je. Poslední takovou podobu dat si ale
                odložil stranou — {neodeslane.kdy ? new Date(neodeslane.kdy).toLocaleString("cs-CZ") : "bez data"}.
                Obsahuje {neodeslane.doc.orders.length} objednávek a {neodeslane.doc.takings.length} dní tržeb.
                Stáhněte si ji a chybějící položky doťukejte ručně — vkládat ji celou přes „Načíst zálohu“
                nedoporučuju, přepsala by i to, co mezitím uložil někdo jiný.
              </div>
              <div className="row">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(neodeslane.doc, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `kvetiny-neodeslane-${neodeslane.kdy.slice(0, 10) || "zmeny"}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Stáhnout neodeslané změny
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    if (!confirm("Opravdu zahodit? Odložená kopie se smaže.")) return;
                    zapomenoutNeodeslane();
                    setNeodeslane(null);
                  }}
                >
                  Už to nepotřebuju
                </button>
              </div>
            </Card>
          )}

          <Card title="Záloha dat">
            <p className="small" style={{ fontFamily: "var(--font-body)", marginBottom: "0.9rem" }}>
              Stažená záloha je obyčejný soubor s daty ke dni stažení. Hodí se, i když běží databáze
              — třeba když si omylem smažete měsíc tržeb.
            </p>
            <dl className="kv small" style={{ marginBottom: "1rem" }}>
              <dt>Naposledy uloženo</dt>
              <dd>{doc.savedAt.startsWith("1970") ? "—" : new Date(doc.savedAt).toLocaleString("cs-CZ")}</dd>
              <dt>Obsah</dt>
              <dd>{doc.orders.length} objednávek · {doc.customers.length} zákazníků · {doc.stock.length} položek skladu</dd>
            </dl>
            {!loaded && (
              <p className="notice notice-danger">
                Data z databáze se zatím nenačetla, na obrazovce je jen kopie z tohohle
                zařízení. Zálohu teď nestahujte — přepsala by tu pořádnou prázdnou.
              </p>
            )}
            <div className="row">
              <button className="btn btn-primary btn-sm" onClick={exportJson} disabled={!loaded}>Stáhnout zálohu</button>
              <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={!loaded}>Načíst zálohu…</button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => e.target.files?.[0] && void importJson(e.target.files[0])}
              />
            </div>
          </Card>

          <Card title="Přihlášení">
            <p className="small" style={{ fontFamily: "var(--font-body)" }}>
              Do adminu se vstupuje jedním heslem, které je nastavené na serveru v proměnné{" "}
              <code>ADMIN_PASSWORD</code> (Vercel → Settings → Environment Variables). Změna hesla
              odhlásí všechna zařízení. Přihlášení platí 30 dní.
            </p>
          </Card>

          <Card title="Ukázka a mazání">
            <div className="row">
              <button className="btn btn-ghost btn-sm" onClick={loadSample}>Načíst ukázková data</button>
              <button className="btn btn-danger btn-sm" onClick={wipe}>Smazat všechna data</button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function SettingsForm({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => void }) {
  const [d, setD] = useState({
    defaultMarkup: String(settings.defaultMarkup),
    vatRate: String(settings.vatRate),
    laborFee: String(settings.laborFee),
    wrapFee: String(settings.wrapFee),
    roundTo: String(settings.roundTo),
  });
  const set = (k: keyof typeof d, v: string) => setD((p) => ({ ...p, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({
      defaultMarkup: parseNumber(d.defaultMarkup) ?? DEFAULT_SETTINGS.defaultMarkup,
      vatRate: parseNumber(d.vatRate) ?? DEFAULT_SETTINGS.vatRate,
      laborFee: parseNumber(d.laborFee) ?? DEFAULT_SETTINGS.laborFee,
      wrapFee: parseNumber(d.wrapFee) ?? DEFAULT_SETTINGS.wrapFee,
      roundTo: parseNumber(d.roundTo) ?? DEFAULT_SETTINGS.roundTo,
    });
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="card-title"><h2>Kalkulačka kytice</h2></div>
      <div className="form-grid">
        <Field label="Marže na materiál (×)" hint="Prodejní cena květin = nákup × tohle číslo. Obvykle 2–3.">
          <input type="text" inputMode="decimal" value={d.defaultMarkup} onChange={(e) => set("defaultMarkup", e.target.value)} />
        </Field>
        <Field label="DPH (%)" hint="Řezané květiny jsou ve snížené sazbě.">
          <input type="text" inputMode="decimal" value={d.vatRate} onChange={(e) => set("vatRate", e.target.value)} />
        </Field>
        <Field label="Práce (Kč)" hint="Paušál za vazbu jedné kytice.">
          <input type="text" inputMode="decimal" value={d.laborFee} onChange={(e) => set("laborFee", e.target.value)} />
        </Field>
        <Field label="Obal (Kč)" hint="Papír, stuha, celofán.">
          <input type="text" inputMode="decimal" value={d.wrapFee} onChange={(e) => set("wrapFee", e.target.value)} />
        </Field>
        <Field label="Zaokrouhlit na (Kč)">
          <input type="text" inputMode="decimal" value={d.roundTo} onChange={(e) => set("roundTo", e.target.value)} />
        </Field>
      </div>
      <div className="row" style={{ marginTop: "1.25rem", justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn-primary">Uložit</button>
      </div>
    </form>
  );
}
