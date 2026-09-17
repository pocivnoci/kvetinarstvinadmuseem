-- ════════════════════════════════════════════════════════════════════
--  Kontrola po nasazení migrací.
--
--  Nic nemění, jen se dívá. Vložte do SQL editoru v Supabase a spusťte.
--  Ve sloupci „výsledek" musí být u všech řádků OK.
-- ════════════════════════════════════════════════════════════════════

with tabulky as (
  select unnest(array['customers','orders','stock','takings','invoices','settings','sync_state']) as t
),
kontroly as (
  -- 1) Existují všechny tabulky?
  select 1 as poradi,
         'Tabulky' as co,
         (select count(*) from tabulky t
           where exists (select 1 from pg_tables p
                          where p.schemaname = 'public' and p.tablename = t.t))::text
           || ' ze 7' as zjisteno,
         case when (select count(*) from tabulky t
                     where exists (select 1 from pg_tables p
                                    where p.schemaname = 'public' and p.tablename = t.t)) = 7
              then 'OK' else 'CHYBA — něco se nevytvořilo' end as vysledek

  -- 2) Je na všech zapnuté RLS?
  union all
  select 2,
         'Zapnuté RLS',
         (select count(*) from pg_class c
           join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relrowsecurity
             and c.relname in (select t from tabulky))::text || ' ze 7',
         case when (select count(*) from pg_class c
                     join pg_namespace n on n.oid = c.relnamespace
                     where n.nspname = 'public' and c.relrowsecurity
                       and c.relname in (select t from tabulky)) = 7
              then 'OK' else 'CHYBA — tabulka bez RLS je čitelná zvenčí' end

  -- 3) Žádná politika = nikdo zvenčí nic nepřečte.
  union all
  select 3,
         'Politiky přístupu (musí být 0)',
         (select count(*) from pg_policies where schemaname = 'public')::text,
         case when (select count(*) from pg_policies where schemaname = 'public') = 0
              then 'OK' else 'CHYBA — politika by data otevřela' end

  -- 4) Obě funkce existují.
  union all
  select 4,
         'Funkce load_admin_doc a save_admin_doc',
         (select count(*) from pg_proc p
           join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public'
             and p.proname in ('load_admin_doc','save_admin_doc'))::text || ' ze 2',
         case when (select count(*) from pg_proc p
                     join pg_namespace n on n.oid = p.pronamespace
                     where n.nspname = 'public'
                       and p.proname in ('load_admin_doc','save_admin_doc')) = 2
              then 'OK' else 'CHYBA — chybí funkce, admin nic neuloží' end

  -- 5) Funkce nesmí běžet právy vlastníka.
  union all
  select 5,
         'Funkce běží právy volajícího',
         (select count(*) from pg_proc p
           join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public'
             and p.proname in ('load_admin_doc','save_admin_doc')
             and p.prosecdef)::text || ' s právy vlastníka',
         case when (select count(*) from pg_proc p
                     join pg_namespace n on n.oid = p.pronamespace
                     where n.nspname = 'public'
                       and p.proname in ('load_admin_doc','save_admin_doc')
                       and p.prosecdef) = 0
              then 'OK' else 'CHYBA — obchází RLS' end

  -- 6) Nejdůležitější: veřejné role nesmí funkce spustit.
  union all
  select 6,
         'Veřejné role nesmí spustit funkce',
         case when has_function_privilege('anon', 'public.save_admin_doc(jsonb,bigint)', 'execute')
              then 'anon MŮŽE ukládat' else 'anon nemůže' end
           || ', ' ||
         case when has_function_privilege('authenticated', 'public.load_admin_doc()', 'execute')
              then 'authenticated MŮŽE číst' else 'authenticated nemůže' end,
         case when has_function_privilege('anon', 'public.save_admin_doc(jsonb,bigint)', 'execute')
                or has_function_privilege('anon', 'public.load_admin_doc()', 'execute')
                or has_function_privilege('authenticated', 'public.save_admin_doc(jsonb,bigint)', 'execute')
                or has_function_privilege('authenticated', 'public.load_admin_doc()', 'execute')
              then 'CHYBA — kdokoli s veřejným klíčem smaže databázi'
              else 'OK' end

  -- 7) Server je spustit musí, jinak admin neuloží nic.
  union all
  select 7,
         'Server (service_role) funkce spustit smí',
         case when has_function_privilege('service_role', 'public.save_admin_doc(jsonb,bigint)', 'execute')
              then 'smí ukládat' else 'NESMÍ ukládat' end,
         case when has_function_privilege('service_role', 'public.save_admin_doc(jsonb,bigint)', 'execute')
               and has_function_privilege('service_role', 'public.load_admin_doc()', 'execute')
              then 'OK' else 'CHYBA — admin neuloží data' end

  -- 8) Řádek nastavení a stavu synchronizace.
  union all
  select 8,
         'Výchozí řádky (nastavení, stav)',
         (select count(*) from public.settings)::text || ' + '
           || (select count(*) from public.sync_state)::text,
         case when (select count(*) from public.settings) = 1
               and (select count(*) from public.sync_state) = 1
              then 'OK' else 'CHYBA — chybí výchozí řádek' end
)
select co as "kontrola", zjisteno as "zjištěno", vysledek as "výsledek"
from kontroly order by poradi;
