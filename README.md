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
| **Peníze — Měsíc** | Denní tržby (hotovost, karta, ostatní) do jednoho formuláře. Sloupcový graf dnů, průměr na otevřený den, nejsilnější den. Měsíční příjmy, výdaje a zisk se počítají samy. Rozpad výdajů po kategoriích. Export tržeb i faktur do CSV pro účetní. |
| **Peníze — Faktury** | Přijaté (výdaj) i vydané (příjem) faktury: protistrana, číslo, vystaveno, splatnost, částka, kategorie, zaplaceno. Filtry na nezaplacené a po splatnosti, součty „dluží nám“ a „dlužíme“. |
| **Peníze — Rok** | Příjmy a výdaje po měsících v grafu i tabulce, zisk a marže za rok, srovnání se stejným obdobím loni. |
| **Zákazníci** | Zakládají se sami z objednávek. Poznámky (oblíbené květiny, alergie), jméno pro svátek a narozeniny — admin pak připomene 14 dní předem. Historie objednávek, tlačítka Zavolat / WhatsApp. |
| **Sklad** | Položky s množstvím, nákupní a prodejní cenou, datem naskladnění a trvanlivostí. Hlídá řezané zboží, kterému dochází čas. Rychlé ±1, hodnota skladu. |
| **Kalkulačka kytice** | Materiál v nákupu × marže + práce + obal, DPH, zaokrouhlení. Položky lze přidat ze skladu. Jedním klikem založí objednávku s vypočtenou cenou. |
| **Svátky a sezóna** | Český kalendář jmen s hledáním, klíčové květinové dny roku (pohyblivé svátky se počítají — Velikonoce, Den matek, advent…), s tipy co objednat a kolik dní předem. |
| **Péče o květiny** | Tahák pro příjem zboží (voda, řez, výdrž, co se s čím nesnáší) a tisk kartičky „Aby vám kytice vydržela“ složené z květin, které v kytici jsou. |
| **Nastavení** | Výchozí marže, DPH, paušály; export a import zálohy (JSON); ukázková data; smazání. |

### Heslo

Do adminu se vstupuje jedním sdíleným heslem. Na Vercelu nastavte proměnnou prostředí **`ADMIN_PASSWORD`** (Settings →
Environment Variables) a nasaďte web znovu. Bez ní admin v produkci nepustí
nikoho; při `npm run dev` se bez hesla otevře rovnou. Přihlášení platí
30 dní, změna hesla odhlásí všechna zařízení. Admin má `noindex` a je
zakázaný v `robots.txt`.

### Jak se počítají peníze

Celá sekce Peníze stojí na jednom pravidle:

```
PŘÍJMY = denní tržby z krámu + vydané faktury
VÝDAJE = přijaté faktury
ZISK   = příjmy − výdaje
```

Z toho plyne jediná věc, kterou je potřeba hlídat při zadávání: **co jde
zákazníkovi na fakturu, se nesmí zároveň zapsat do denní tržby**, jinak by se
ten samý příjem počítal dvakrát. Upozorňuje na to i text pod formulářem.

Faktura patří do měsíce podle **data vystavení**, ne podle zaplacení — aby
měsíc seděl s tím, co uvidí účetní. Zaplacení se sleduje zvlášť a slouží
k hlídání splatnosti.

Rozjetý měsíc se nesrovnává s celým minulým (to by pořád vypadalo jako
propad), ale se **stejně dlouhým úsekem**: 1.–dnešek proti 1.–témuž dni
minulého měsíce. Stejně tak rok proti stejnému období loni.

Na každý den je nejvýš jeden záznam tržby; uložení stejného data ten
předchozí přepíše.

### Kde jsou data

Admin umí běžet ve dvou režimech a pozná to sám podle proměnných prostředí.
Aktuální stav je vidět vlevo dole a v Nastavení.

**Databáze (Supabase).** Když jsou nastavené `SUPABASE_URL` a
`SUPABASE_SECRET_KEY`, data žijí v databázi a jsou stejná na mobilu i na
počítači v krámu. Prohlížeč s databází nemluví přímo — chodí přes
`/api/admin/data`, takže tajný klíč zůstává na serveru. Místní kopie
v prohlížeči slouží jen pro výpadek internetu: co zadáte bez signálu, se
odešle, jakmile se připojení vrátí.

**Jen tento prohlížeč.** Když proměnné chybí, admin funguje dál, ale data
zůstanou v tom jednom prohlížeči. Druhé zařízení je neuvidí a vymazání dat
prohlížeče je smaže.

V obou režimech je v Nastavení **Stáhnout zálohu** (JSON) a **Načíst zálohu**.
I s databází se hodí — třeba když si omylem smažete měsíc tržeb.

#### Souběh dvou zařízení

Ukládá se celý dokument najednou, v jedné transakci, a databáze u sebe drží
číslo revize. Admin posílá revizi, ze které vycházel; když mezitím uložil
někdo jiný, databáze nic nepřepíše a vrátí `conflict`. Admin si pak stáhne
aktuální data a přehraje na ně své neuložené úpravy (drží si je jako operace,
ne jako hotový výsledek), takže se cizí práce neztratí.

### Nastavení databáze

1. V Supabase založte projekt (region `eu-central-1`, Frankfurt je Praze
   nejblíž).
2. Pusťte migrace ze složky `supabase/migrations/` v pořadí — buď v SQL
   editoru v Supabase (zkopírovat obsah souboru a spustit), nebo přes
   Supabase CLI (`supabase db push`).
3. V Supabase → Project Settings → API zkopírujte URL projektu a **tajný**
   klíč (`service_role` / `sb_secret_…`).
4. Vložte je do `.env.local` (lokálně) a na Vercelu do Environment Variables
   jako `SUPABASE_URL` a `SUPABASE_SECRET_KEY`, pak web znovu nasaďte.

Tajný klíč obchází pravidla přístupu k datům, takže nesmí do repozitáře ani
nikam, odkud by ho přečetl prohlížeč. `.env*.local` je v `.gitignore`.

Bezpečnost na straně databáze stojí na třech vrstvách:

1. **RLS bez politik** na všech tabulkách — anonymní ani přihlášená role
   nepřečte ani nezapíše jediný řádek.
2. **Odebrané právo spouštět funkce** `load_admin_doc` a `save_admin_doc`,
   a to včetně role `PUBLIC`. To je snadné přehlédnout: Postgres dává právo
   spouštět funkce implicitně všem, takže odebrání rolím `anon`
   a `authenticated` nestačí — bez odebrání `PUBLIC` by obě funkce šly
   zavolat veřejným klíčem projektu a prázdným dokumentem smazat celou
   databázi.
3. **Funkce běží právy volajícího**, ne svými (žádné `security definer`).
   I kdyby někdo prolomil druhou vrstvu, naráží na RLS z první.

Migrace jsou otestované na čistém Postgresu 16: obě projdou, uložení
a načtení vrátí stejná data včetně české diakritiky, kontroly odmítnou
rozvoz bez adresy i dvě tržby na stejný den, a útok veřejnou rolí na obě
funkce skončí odmítnutím.

#### Kontrola po nasazení

Po spuštění migrací vložte do SQL editoru **`supabase/kontrola.sql`**. Nic
nemění, jen projde osm bodů (tabulky, RLS, politiky, obě funkce, práva na
jejich spuštění, výchozí řádky) a u každého napíše OK nebo CHYBA i s tím,
co je špatně. Sama kontrola je ověřená proti rozbitým stavům: umí poznat
vypnuté RLS, přidanou politiku i omylem povolené spuštění funkce veřejnou
rolí.

### Úpravy dat

- Kalendář jmen: `src/lib/admin/svatky.ts`
- Klíčové dny roku a tipy: `src/lib/admin/klicove-dny.ts`
- Péče o květiny: `src/lib/admin/pece.ts`
- Příležitosti a stavy objednávek, kategorie výdajů: `src/lib/admin/types.ts`
- Výpočty kolem peněz a export CSV: `src/lib/admin/penize.ts`
- Schéma databáze: `supabase/migrations/`
- Ukládání a synchronizace: `src/lib/admin/store.ts`, `src/lib/admin/db.ts`

Barvy grafů (`src/components/admin/charts.tsx`) prošly kontrolou na
rozlišitelnost pro barvoslepé a kontrast proti krémovému pozadí; při změně
je potřeba ověřit znovu, jinak se dvě série můžou slít v jednu.
