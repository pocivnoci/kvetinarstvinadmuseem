-- ════════════════════════════════════════════════════════════════════
--  Kontrola importu tržeb ze sešitu
--
--  Nic nemění, jen počítá. Očekávaná čísla jsou napsaná přímo v dotazu,
--  takže ve sloupci „výsledek" musí být u všech řádků OK.
--  Vložte do SQL editoru v Supabase a spusťte.
-- ════════════════════════════════════════════════════════════════════

with ocekavano(poradi, co, hodnota) as (values
  (1, 'Počet dní',                    74),
  (2, 'Tržba celkem (Kč)',        266349),
  (3, 'Hotovost (Kč)',             53608),
  (4, 'Karta (Kč)',               191440),
  (5, 'Ostatní — Nesnězeno.cz a převody (Kč)', 21301),
  (6, 'Červen (Kč)',               72266),
  (7, 'Červenec (Kč)',             59528),
  (8, 'Srpen (Kč)',                59331),
  (9, 'Září (Kč)',                 75224),
  (10,'Dní s poznámkou Nesnězeno.cz',   31)
),
skutecnost(poradi, hodnota) as (
  select 1,  count(*)::int from public.takings
  union all select 2,  coalesce(sum(cash+card+other),0)::int from public.takings
  union all select 3,  coalesce(sum(cash),0)::int  from public.takings
  union all select 4,  coalesce(sum(card),0)::int  from public.takings
  union all select 5,  coalesce(sum(other),0)::int from public.takings
  union all select 6,  coalesce(sum(cash+card+other),0)::int from public.takings where date between '2026-06-01' and '2026-06-30'
  union all select 7,  coalesce(sum(cash+card+other),0)::int from public.takings where date between '2026-07-01' and '2026-07-31'
  union all select 8,  coalesce(sum(cash+card+other),0)::int from public.takings where date between '2026-08-01' and '2026-08-31'
  union all select 9,  coalesce(sum(cash+card+other),0)::int from public.takings where date between '2026-09-01' and '2026-09-30'
  union all select 10, count(*)::int from public.takings where note like '%Nesnězeno%'
)
select o.co                                   as "kontrola",
       s.hodnota                              as "v databázi",
       o.hodnota                              as "má být",
       case when s.hodnota = o.hodnota then 'OK'
            else 'CHYBA (rozdíl ' || (s.hodnota - o.hodnota) || ')' end as "výsledek"
from ocekavano o join skutecnost s using (poradi)

union all

-- Dva dodatečné testy: žádný den dvakrát, žádný mimo očekávané období.
select 'Dvakrát zapsaný den', count(*)::int, 0,
       case when count(*) = 0 then 'OK' else 'CHYBA' end
from (select date from public.takings group by date having count(*) > 1) d

union all
select 'Den mimo 2. 6. – 18. 9. 2026', count(*)::int, 0,
       case when count(*) = 0 then 'OK' else 'CHYBA' end
from public.takings where date < '2026-06-02' or date > '2026-09-18'

order by 1;
