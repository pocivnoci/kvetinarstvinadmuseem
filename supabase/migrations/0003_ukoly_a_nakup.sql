-- ════════════════════════════════════════════════════════════════════
--  Úkoly a nákupní seznam
--
--  Dvě nové tabulky a rozšíření obou funkcí, přes které admin data
--  načítá a ukládá. Zbytek schématu se nemění.
-- ════════════════════════════════════════════════════════════════════

-- ── Úkoly ───────────────────────────────────────────────────────────
create table public.tasks (
  id         text primary key default gen_random_uuid()::text,
  title      text not null check (length(btrim(title)) > 0),
  note       text,
  -- Bez data = úkol bez termínu, dělá se, až bude čas.
  due        date,
  done       boolean not null default false,
  done_at    timestamptz,
  -- Opakovaný úkol se po odškrtnutí založí znovu na další termín.
  repeat     text not null default 'zadne'
               check (repeat in ('zadne', 'denne', 'tydne', 'mesicne')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Hotový úkol má čas dokončení a nehotový ne.
  constraint tasks_done_ma_cas check (done = (done_at is not null)),
  -- Opakovat se dá jen úkol, který má termín.
  constraint tasks_opakovani_ma_termin check (repeat = 'zadne' or due is not null)
);

create index tasks_due_idx on public.tasks (due) where not done;

-- ── Nákupní seznam ──────────────────────────────────────────────────
create table public.shopping_items (
  id         text primary key default gen_random_uuid()::text,
  name       text not null check (length(btrim(name)) > 0),
  qty        numeric(10, 2) check (qty is null or qty > 0),
  unit       text,
  -- U koho se to kupuje; podle toho se seznam na nákupu seskupuje.
  supplier   text,
  note       text,
  bought     boolean not null default false,
  bought_at  timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint shopping_koupeno_ma_cas check (bought = (bought_at is not null))
);

create index shopping_supplier_idx on public.shopping_items (supplier) where not bought;

-- ── Spouště a zámek ─────────────────────────────────────────────────
create trigger tasks_touch before update on public.tasks
  for each row execute function public.touch_updated_at();
create trigger shopping_touch before update on public.shopping_items
  for each row execute function public.touch_updated_at();

alter table public.tasks          enable row level security;
alter table public.shopping_items enable row level security;

-- ── Obě funkce znovu, už i s úkoly a nákupním seznamem ──────────────
--
--  Definice je schválně celá, ne nadstavba nad starou verzí. Jedna
--  funkce, jedno místo, kde se dá přečíst, co přesně se načítá a ukládá.
--

create or replace function public.load_admin_doc()
returns jsonb
language sql
set search_path = ''
stable
as $$
  select jsonb_build_object(
    'version', 1,
    'revision', s.revision,
    'savedAt', to_char(s.saved_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'nextOrderNumber', s.next_order_number,

    'orders', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', o.id,
        'cislo', o.cislo,
        'createdAt', to_char(o.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'updatedAt', to_char(o.updated_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'customerName', o.customer_name,
        'customerPhone', o.customer_phone,
        'customerEmail', o.customer_email,
        'fulfillment', o.fulfillment,
        'date', to_char(o.date, 'YYYY-MM-DD'),
        'time', to_char(o.time, 'HH24:MI'),
        'address', o.address,
        'recipientName', o.recipient_name,
        'recipientPhone', o.recipient_phone,
        'occasion', o.occasion,
        'description', o.description,
        'price', o.price,
        'deposit', o.deposit,
        'paid', o.paid,
        'cardMessage', o.card_message,
        'note', o.note,
        'status', o.status
      )) order by o.date, o.cislo)
      from public.orders o), '[]'::jsonb),

    'customers', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'phone', c.phone,
        'email', c.email,
        'address', c.address,
        'note', c.note,
        'birthday', c.birthday,
        'namedayName', c.nameday_name,
        'createdAt', to_char(c.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      )) order by c.name)
      from public.customers c), '[]'::jsonb),

    'stock', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', st.id,
        'name', st.name,
        'category', st.category,
        'qty', st.qty,
        'unit', st.unit,
        'costPrice', st.cost_price,
        'salePrice', st.sale_price,
        'receivedAt', to_char(st.received_at, 'YYYY-MM-DD'),
        'shelfLifeDays', st.shelf_life_days,
        'supplier', st.supplier,
        'note', st.note
      )) order by st.name)
      from public.stock st), '[]'::jsonb),

    'takings', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', t.id,
        'date', to_char(t.date, 'YYYY-MM-DD'),
        'cash', t.cash,
        'card', t.card,
        'other', t.other,
        'note', t.note
      )) order by t.date)
      from public.takings t), '[]'::jsonb),

    'invoices', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', i.id,
        'kind', i.kind,
        'number', i.number,
        'party', i.party,
        'issuedAt', to_char(i.issued_at, 'YYYY-MM-DD'),
        'dueAt', to_char(i.due_at, 'YYYY-MM-DD'),
        'amount', i.amount,
        'category', i.category,
        'paid', i.paid,
        'paidAt', to_char(i.paid_at, 'YYYY-MM-DD'),
        'note', i.note
      )) order by i.issued_at desc)
      from public.invoices i), '[]'::jsonb),

    'tasks', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', t.id,
        'title', t.title,
        'note', t.note,
        'due', to_char(t.due, 'YYYY-MM-DD'),
        'done', t.done,
        'doneAt', to_char(t.done_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'repeat', t.repeat,
        'createdAt', to_char(t.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      )) order by t.done, t.due nulls last, t.created_at)
      from public.tasks t), '[]'::jsonb),

    'shopping', coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', sh.id,
        'name', sh.name,
        'qty', sh.qty,
        'unit', sh.unit,
        'supplier', sh.supplier,
        'note', sh.note,
        'bought', sh.bought,
        'boughtAt', to_char(sh.bought_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
        'createdAt', to_char(sh.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      )) order by sh.bought, sh.supplier nulls last, sh.created_at)
      from public.shopping_items sh), '[]'::jsonb),

    'settings', (
      select jsonb_build_object(
        'defaultMarkup', g.default_markup,
        'vatRate', g.vat_rate,
        'laborFee', g.labor_fee,
        'wrapFee', g.wrap_fee,
        'roundTo', g.round_to
      ) from public.settings g where g.id)
  )
  from public.sync_state s where s.id;
$$;


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
  if expected_revision is not null and expected_revision <> current_rev then
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

-- Zámek č. 1: odebrat právo spouštět všem kromě serveru.
-- PUBLIC je tu klíčové — bez něj zůstane funkce spustitelná veřejným klíčem.
revoke all on function public.load_admin_doc() from public, anon, authenticated;
revoke all on function public.save_admin_doc(jsonb, bigint) from public, anon, authenticated;

grant execute on function public.load_admin_doc() to service_role;
grant execute on function public.save_admin_doc(jsonb, bigint) to service_role;
