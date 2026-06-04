# Obrázky — placeholdery

Sem patří skutečné fotky z krámku. Doporučené rozměry a poměry:

| Soubor | Použito v | Doporučený poměr | Min. šířka |
|---|---|---|---|
| `shop-1.jpg` | Prostor (velký tile vlevo) | 4:5 nebo 3:4 (portrét) | 1600 px |
| `shop-2.jpg` | Prostor (vpravo nahoře) | 4:3 (landscape) | 1200 px |
| `shop-3.jpg` | Prostor (vpravo dole) + About | 4:5 (portrét) | 1200 px |
| `wallpaper.jpg` | WallpaperFeature (dark sekce) | 16:9 nebo širší | 2400 px |

## Poznámky

- **wallpaper.jpg** by měla být plochá fotka Morris-style tapety ze zadní stěny krámku. Pokud není k dispozici, sekce má fallback CSS pattern.
- Komprese: 80% JPEG nebo přejít na WebP/AVIF.
- Bez fotek se na místě tilů zobrazí placeholder barvy z `<figure>` (růžová, černá, sage).
