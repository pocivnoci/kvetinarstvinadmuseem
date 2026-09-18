-- ════════════════════════════════════════════════════════════════════
--  Bez čísla revize se neukládá
--
--  save_admin_doc ukládá celý dokument a řádky, které v něm nejsou, maže.
--  Kontrola souběhu se ale při expected_revision = null přeskakovala, takže
--  prázdný dokument bez revize prošel jako platný zápis a smazal obsah všech
--  osmi tabulek. Stačilo k tomu, aby se adminu nepovedlo načtení (vypadlá
--  wifi, uspaná databáze) a floristka pak cokoliv uložila.
--
--  Ověřeno na čisté Postgres 16: před opravou jedno odškrtnutí úkolu
--  smazalo 74 dní tržeb (266 349 Kč) a vrátilo {"ok": true}.
--
--  Mění se jediná podmínka, zbytek funkce je shodný s 0003.
-- ════════════════════════════════════════════════════════════════════

create or replace function public.save_admin_doc(doc jsonb, expected_revision bigint default null)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  current_rev bigint;
  new_rev     bigint;
begin
  select revision into current_rev from public.sync_state where id for update;

  -- Někdo uložil dřív: neukládat a říct to. Admin si data načte znovu.
  -- Bez čísla revize se neukládá. Dřív se kontrola při null přeskočila,
  -- takže klient, kterému se nepovedlo načtení, mohl prázdným dokumentem
  -- smazat všechno, co v databázi bylo.
  if expected_revision is null or expected_revision <> current_rev then
    return jsonb_build_object('ok', false, 'conflict', true, 'revision', current_rev);
  end if;

  -- ── Zákazníci ──
  delete from public.customers c
   where not exists (
     select 1 from jsonb_array_elements(coalesce(doc->'customers', '[]'::jsonb)) e
      where e->>'id' = c.id);

  insert into public.customers (id, name, phone, email, address, note, birthday, nameday_name, created_at)
  select e->>'id', e->>'name', e->>'phone', e->>'email', e->>'address', e->>'note',
         e->>'birthday', e->>'namedayName',
         coalesce((e->>'createdAt')::timestamptz, now())
    from jsonb_array_elements(coalesce(doc->'customers', '[]'::jsonb)) e
  on conflict (id) do update set
    name = excluded.name, phone = excluded.phone, email = excluded.email,
    address = excluded.address, note = excluded.note, birthday = excluded.birthday,
    nameday_name = excluded.nameday_name;

  -- ── Objednávky ──
  delete from public.orders o
   where not exists (
     select 1 from jsonb_array_elements(coalesce(doc->'orders', '[]'::jsonb)) e
      where e->>'id' = o.id);

  insert into public.orders (
    id, cislo, customer_name, customer_phone, customer_email, fulfillment, date, time,
    address, recipient_name, recipient_phone, occasion, description, price, deposit,
    paid, card_message, note, status, created_at, updated_at)
  select e->>'id', (e->>'cislo')::integer, e->>'customerName', e->>'customerPhone', e->>'customerEmail',
         e->>'fulfillment', (e->>'date')::date, nullif(e->>'time', '')::time,
         e->>'address', e->>'recipientName', e->>'recipientPhone', e->>'occasion', e->>'description',
         (e->>'price')::numeric, (e->>'deposit')::numeric,
         coalesce((e->>'paid')::boolean, false), e->>'cardMessage', e->>'note',
         coalesce(e->>'status', 'nova'),
         coalesce((e->>'createdAt')::timestamptz, now()),
         coalesce((e->>'updatedAt')::timestamptz, now())
    from jsonb_array_elements(coalesce(doc->'orders', '[]'::jsonb)) e
  on conflict (id) do update set
    cislo = excluded.cislo, customer_name = excluded.customer_name,
    customer_phone = excluded.customer_phone, customer_email = excluded.customer_email,
    fulfillment = excluded.fulfillment, date = excluded.date, time = excluded.time,
    address = excluded.address, recipient_name = excluded.recipient_name,
    recipient_phone = excluded.recipient_phone, occasion = excluded.occasion,
    description = excluded.description, price = excluded.price, deposit = excluded.deposit,
    paid = excluded.paid, card_message = excluded.card_message, note = excluded.note,
    status = excluded.status;

  -- ── Sklad ──
  delete from public.stock s
   where not exists (
     select 1 from jsonb_array_elements(coalesce(doc->'stock', '[]'::jsonb)) e
      where e->>'id' = s.id);

  insert into public.stock (id, name, category, qty, unit, cost_price, sale_price,
                            received_at, shelf_life_days, supplier, note)
  select e->>'id', e->>'name', e->>'category', coalesce((e->>'qty')::numeric, 0),
         coalesce(e->>'unit', 'ks'), coalesce((e->>'costPrice')::numeric, 0),
         (e->>'salePrice')::numeric, (e->>'receivedAt')::date,
         coalesce((e->>'shelfLifeDays')::integer, 0), e->>'supplier', e->>'note'
    from jsonb_array_elements(coalesce(doc->'stock', '[]'::jsonb)) e
  on conflict (id) do update set
    name = excluded.name, category = excluded.category, qty = excluded.qty,
    unit = excluded.unit, cost_price = excluded.cost_price, sale_price = excluded.sale_price,
    received_at = excluded.received_at, shelf_life_days = excluded.shelf_life_days,
    supplier = excluded.supplier, note = excluded.note;

  -- ── Denní tržby ──
  delete from public.takings t
   where not exists (
     select 1 from jsonb_array_elements(coalesce(doc->'takings', '[]'::jsonb)) e
      where e->>'id' = t.id);

  insert into public.takings (id, date, cash, card, other, note)
  select e->>'id', (e->>'date')::date, coalesce((e->>'cash')::numeric, 0),
         coalesce((e->>'card')::numeric, 0), coalesce((e->>'other')::numeric, 0), e->>'note'
    from jsonb_array_elements(coalesce(doc->'takings', '[]'::jsonb)) e
  on conflict (id) do update set
    date = excluded.date, cash = excluded.cash, card = excluded.card,
    other = excluded.other, note = excluded.note;

  -- ── Faktury ──
  delete from public.invoices i
   where not exists (
     select 1 from jsonb_array_elements(coalesce(doc->'invoices', '[]'::jsonb)) e
      where e->>'id' = i.id);

  insert into public.invoices (id, kind, number, party, issued_at, due_at, amount,
                               category, paid, paid_at, note)
  select e->>'id', e->>'kind', e->>'number', e->>'party', (e->>'issuedAt')::date,
         nullif(e->>'dueAt', '')::date, coalesce((e->>'amount')::numeric, 0), e->>'category',
         coalesce((e->>'paid')::boolean, false), nullif(e->>'paidAt', '')::date, e->>'note'
    from jsonb_array_elements(coalesce(doc->'invoices', '[]'::jsonb)) e
  on conflict (id) do update set
    kind = excluded.kind, number = excluded.number, party = excluded.party,
    issued_at = excluded.issued_at, due_at = excluded.due_at, amount = excluded.amount,
    category = excluded.category, paid = excluded.paid, paid_at = excluded.paid_at,
    note = excluded.note;

  -- ── Úkoly ──
  delete from public.tasks t
   where not exists (
     select 1 from jsonb_array_elements(coalesce(doc->'tasks', '[]'::jsonb)) e
      where e->>'id' = t.id);

  insert into public.tasks (id, title, note, due, done, done_at, repeat, created_at)
  select e->>'id', e->>'title', e->>'note', nullif(e->>'due', '')::date,
         coalesce((e->>'done')::boolean, false),
         nullif(e->>'doneAt', '')::timestamptz,
         coalesce(e->>'repeat', 'zadne'),
         coalesce((e->>'createdAt')::timestamptz, now())
    from jsonb_array_elements(coalesce(doc->'tasks', '[]'::jsonb)) e
  on conflict (id) do update set
    title = excluded.title, note = excluded.note, due = excluded.due,
    done = excluded.done, done_at = excluded.done_at, repeat = excluded.repeat;

  -- ── Nákupní seznam ──
  delete from public.shopping_items s
   where not exists (
     select 1 from jsonb_array_elements(coalesce(doc->'shopping', '[]'::jsonb)) e
      where e->>'id' = s.id);

  insert into public.shopping_items (id, name, qty, unit, supplier, note, bought, bought_at, created_at)
  select e->>'id', e->>'name', (e->>'qty')::numeric, e->>'unit', e->>'supplier', e->>'note',
         coalesce((e->>'bought')::boolean, false),
         nullif(e->>'boughtAt', '')::timestamptz,
         coalesce((e->>'createdAt')::timestamptz, now())
    from jsonb_array_elements(coalesce(doc->'shopping', '[]'::jsonb)) e
  on conflict (id) do update set
    name = excluded.name, qty = excluded.qty, unit = excluded.unit,
    supplier = excluded.supplier, note = excluded.note,
    bought = excluded.bought, bought_at = excluded.bought_at;

  -- ── Nastavení (jediný řádek) ──
  update public.settings set
    default_markup = coalesce((doc->'settings'->>'defaultMarkup')::numeric, default_markup),
    vat_rate       = coalesce((doc->'settings'->>'vatRate')::numeric, vat_rate),
    labor_fee      = coalesce((doc->'settings'->>'laborFee')::numeric, labor_fee),
    wrap_fee       = coalesce((doc->'settings'->>'wrapFee')::numeric, wrap_fee),
    round_to       = coalesce((doc->'settings'->>'roundTo')::integer, round_to)
  where id;

  update public.sync_state set
    revision = current_rev + 1,
    next_order_number = greatest(
      coalesce((doc->>'nextOrderNumber')::integer, 1),
      coalesce((select max(cislo) + 1 from public.orders), 1)),
    saved_at = now()
  where id
  returning revision into new_rev;

  return jsonb_build_object('ok', true, 'revision', new_rev);
end;
$$;

-- Práva se při create or replace nemění, ale radši je potvrdit.
revoke all on function public.save_admin_doc(jsonb, bigint) from public, anon, authenticated;
grant execute on function public.save_admin_doc(jsonb, bigint) to service_role;
