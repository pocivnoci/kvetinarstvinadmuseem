# Květiny nad museem

Web rodinného květinářství na Vinohradské 6 v Praze. Next.js 14 (App Router),
dvojjazyčně česky a anglicky, styly přes CSS proměnné v `src/app/globals.css`.

```bash
npm run dev     # vývoj
npm run build   # produkční build
npm run qr      # QR kódy pro /odkazy do public/qr/
```

## Stránka /odkazy

Vlastní náhrada Linktree — cíl QR kódů z vizitek a samolepek a odkazu
z Instagram bia. Do sitemapy nepatří a má `noindex, follow`, aby
nekonkurovala homepage.

### Jak upravit odkazy

Vše je v jediném souboru **`src/data/odkazy.ts`**, do komponenty se nesahá:

1. **Přidat odkaz** — zkopíruj blok `{ id, label, sublabel, href, icon, enabled, order }` a dej mu vlastní `id` a `order`.
2. **Vypnout odkaz** — přepiš `enabled: true` na `enabled: false`; řádek zůstane v souboru, jen se nezobrazí.
3. **Přeskládat pořadí** — změň číslo v `order` (řadí se vzestupně odshora dolů).

Texty kolem odkazů (název, věta pod logem, otevírací doba, adresa, patička)
jsou ve stejném souboru v `ODKAZY_PAGE`.

### Měření

`NEXT_PUBLIC_META_PIXEL_ID` — ID Meta Pixelu. Když proměnná chybí, pixel se
prostě nenačte a stránka funguje dál.

Na webu neběží žádná consent platforma, takže se souhlas řeší přímo na
/odkazy: pixel se načte až po kliknutí na „Souhlasím“, volba se pamatuje
v localStorage. Bez souhlasu se nenačítá žádný skript třetí strany.

Odkazy dostávají UTM automaticky podle `id` položky
(`utm_source=odkazy`, `utm_medium=linkpage`, `utm_campaign=<id>`).
Stránka navíc čte `?src=` s hodnotami `vizitka`, `samolepka`, `ig`, `wolt`
a propisuje ji do `utm_content` i do pixel eventů — díky tomu je vidět,
který nosič lidi přivedl.

### Odkaz do Instagram bia

```
https://kvetinynadmuseem.cz/odkazy?src=ig
```

Vkládá se ručně v aplikaci Instagram → Upravit profil → Odkazy.

### QR kódy

```bash
npm run qr                                   # 40 mm @ 300 DPI, SVG i PNG
QR_SIZE_MM=25 QR_DPI=600 npm run qr          # jiná velikost nebo rozlišení
```

## Admin pro floristku — /admin

Interní nástroj pro provoz krámu, jen česky, chráněný heslem. Běží na
stejném webu (`kvetinynadmuseem.cz/admin`), na mobilu má spodní lištu se
záložkami, na počítači boční navigaci.

### Co umí

| Sekce | K čemu |
|---|---|
| **Přehled** | Dnešní objednávky, příštích 7 dní, upozornění na zboží s končící trvanlivostí, kdo má svátek, blížící se velké dny (Valentýn, Den matek…), zákazníci s blížícím se svátkem/narozeninami, tržba za měsíc. |
| **Objednávky** | Kytice na objednávku: zákazník, vyzvednutí / rozvoz s adresou, termín, příležitost, popis kytice, text na kartičku, cena, záloha, stav (nová → potvrzená → v přípravě → hotová → předaná). Hledání a filtry. |
| **Tisk** | Průvodka pro dílnu / kurýra a kartička s přáním, každá na vlastní stránce (`/admin/objednavky/<id>/tisk`). |
| **Kalendář** | Týdenní přehled objednávek se svátky a květinovými dny, šipkami po týdnech. |
| **Zákazníci** | Zakládají se sami z objednávek. Poznámky (oblíbené květiny, alergie), jméno pro svátek a narozeniny — admin pak připomene 14 dní předem. Historie objednávek, tlačítka Zavolat / WhatsApp. |
| **Sklad** | Položky s množstvím, nákupní a prodejní cenou, datem naskladnění a trvanlivostí. Hlídá řezané zboží, kterému dochází čas. Rychlé ±1, hodnota skladu. |
| **Kalkulačka kytice** | Materiál v nákupu × marže + práce + obal, DPH, zaokrouhlení. Položky lze přidat ze skladu. Jedním klikem založí objednávku s vypočtenou cenou. |
| **Svátky a sezóna** | Český kalendář jmen s hledáním, klíčové květinové dny roku (pohyblivé svátky se počítají — Velikonoce, Den matek, advent…), s tipy co objednat a kolik dní předem. |
| **Péče o květiny** | Tahák pro příjem zboží (voda, řez, výdrž, co se s čím nesnáší) a tisk kartičky „Aby vám kytice vydržela“ složené z květin, které v kytici jsou. |
| **Nastavení** | Výchozí marže, DPH, paušály; export a import zálohy (JSON); ukázková data; smazání. |

### Heslo

Na Vercelu nastavte proměnnou prostředí **`ADMIN_PASSWORD`** (Settings →
Environment Variables) a nasaďte web znovu. Bez ní admin v produkci nepustí
nikoho; při `npm run dev` se bez hesla otevře rovnou. Přihlášení platí
30 dní, změna hesla odhlásí všechna zařízení. Admin má `noindex` a je
zakázaný v `robots.txt`.

### Kde jsou data

Data adminu se ukládají **v prohlížeči zařízení, kde se zadala**
(`localStorage`) — nikam na server neodcházejí. Funguje to hned bez databáze,
ale znamená to:

- druhý telefon / počítač data nevidí,
- vymazání dat prohlížeče je smaže.

Proto je v Nastavení tlačítko **Stáhnout zálohu** (JSON) a **Načíst zálohu**
— doporučujeme zálohovat třeba každý pátek. Úložiště je oddělené v jediném
souboru `src/lib/admin/store.ts` (`read()`/`write()`), takže přechod na
sdílenou databázi (Supabase, Vercel KV) je výměna těchto dvou funkcí, ne
přepis adminu.

### Úpravy dat

- Kalendář jmen: `src/lib/admin/svatky.ts`
- Klíčové dny roku a tipy: `src/lib/admin/klicove-dny.ts`
- Péče o květiny: `src/lib/admin/pece.ts`
- Příležitosti a stavy objednávek: `src/lib/admin/types.ts`
