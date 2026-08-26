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
