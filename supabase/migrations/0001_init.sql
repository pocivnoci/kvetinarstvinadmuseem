-- ════════════════════════════════════════════════════════════════════
--  Květiny nad museem — schéma adminu
--
--  Zrcadlí datový model z src/lib/admin/types.ts. Pojmenování sloupců
--  je snake_case (konvence Postgresu), převod na tvar, který zná admin,
--  dělá aplikace.
--
--  Bezpečnost: na všech tabulkách je zapnuté RLS a záměrně k nim nejsou
--  žádné politiky. Bez politiky Postgres nepustí ani anonymní, ani
--  přihlášené role — dokud se přístup výslovně nepovolí, data nikdo
--  zvenčí nepřečte. To je bezpečný výchozí stav, ne opomenutí.
-- ════════════════════════════════════════════════════════════════════

-- Automatická aktualizace updated_at při každé změně řádku.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Zákazníci ───────────────────────────────────────────────────────
create table public.customers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text not null,
  email         text,
  address       text,
  note          text,
  -- MM-DD, rok nás nezajímá
  birthday      text check (birthday is null or birthday ~ '^\d{2}-\d{2}$'),
  nameday_name  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Telefon slouží jako přirozený klíč při párování objednávek.
create index customers_phone_idx on public.customers (phone);

-- ── Objednávky ──────────────────────────────────────────────────────
-- Pořadové číslo dává databáze, ať se dvě zařízení nepotkají na stejném.
create sequence public.order_number_seq as integer start 1;

create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  cislo           integer not null unique default nextval('public.order_number_seq'),

  customer_name   text not null,
  customer_phone  text not null,
  customer_email  text,

  fulfillment     text not null check (fulfillment in ('vyzvednuti', 'rozvoz')),
  date            date not null,
  time            time,
  address         text,
  recipient_name  text,
  recipient_phone text,

  occasion        text not null,
  description     text not null,
  price           numeric(10, 2),
  deposit         numeric(10, 2),
  paid            boolean not null default false,
  card_message    text,
  note            text,
  status          text not null default 'nova'
                    check (status in ('nova', 'potvrzena', 'v-priprave', 'hotova', 'predana', 'zrusena')),

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- Rozvoz se nedá uložit bez adresy.
  constraint orders_rozvoz_ma_adresu
    check (fulfillment <> 'rozvoz' or (address is not null and length(btrim(address)) > 0))
);

alter sequence public.order_number_seq owned by public.orders.cislo;

create index orders_date_idx on public.orders (date);
create index orders_status_idx on public.orders (status);
create index orders_phone_idx on public.orders (customer_phone);

-- ── Sklad ───────────────────────────────────────────────────────────
create table public.stock (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  category        text not null check (category in ('rezane', 'hrnkove', 'susene', 'doplnky')),
  qty             numeric(10, 2) not null default 0 check (qty >= 0),
  unit            text not null default 'ks',
  cost_price      numeric(10, 2) not null default 0 check (cost_price >= 0),
  sale_price      numeric(10, 2) check (sale_price >= 0),
  received_at     date not null,
  -- 0 = trvanlivost se nehlídá (hrnkové, sušené, doplňky)
  shelf_life_days integer not null default 0 check (shelf_life_days >= 0),
  supplier        text,
  note            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index stock_category_idx on public.stock (category);

-- ── Denní tržby ─────────────────────────────────────────────────────
-- Na jeden den připadá nejvýš jeden záznam; proto unikátní datum.
create table public.takings (
  id         uuid primary key default gen_random_uuid(),
  date       date not null unique,
  cash       numeric(10, 2) not null default 0 check (cash >= 0),
  card       numeric(10, 2) not null default 0 check (card >= 0),
  other      numeric(10, 2) not null default 0 check (other >= 0),
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Faktury ─────────────────────────────────────────────────────────
create table public.invoices (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('prijata', 'vydana')),
  number     text not null,
  party      text not null,
  -- Do měsíce faktura patří podle vystavení, ne podle zaplacení.
  issued_at  date not null,
  due_at     date,
  amount     numeric(12, 2) not null check (amount >= 0),
  category   text,
  paid       boolean not null default false,
  paid_at    date,
  note       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Zaplacená faktura má datum zaplacení a nezaplacená ne.
  constraint invoices_paid_ma_datum check (paid = (paid_at is not null))
);

create index invoices_issued_at_idx on public.invoices (issued_at);
create index invoices_unpaid_idx on public.invoices (due_at) where not paid;

-- ── Nastavení ───────────────────────────────────────────────────────
-- Jediný řádek: primární klíč smí být jen true.
create table public.settings (
  id             boolean primary key default true check (id),
  default_markup numeric(5, 2) not null default 2.5,
  vat_rate       numeric(5, 2) not null default 12,
  labor_fee      numeric(10, 2) not null default 150,
  wrap_fee       numeric(10, 2) not null default 60,
  round_to       integer not null default 10 check (round_to >= 1),
  updated_at     timestamptz not null default now()
);

insert into public.settings (id) values (true);

-- ── Spouště pro updated_at ──────────────────────────────────────────
create trigger customers_touch before update on public.customers
  for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();
create trigger stock_touch before update on public.stock
  for each row execute function public.touch_updated_at();
create trigger takings_touch before update on public.takings
  for each row execute function public.touch_updated_at();
create trigger invoices_touch before update on public.invoices
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ── Zámek: RLS zapnuté, žádné politiky ──────────────────────────────
alter table public.customers enable row level security;
alter table public.orders    enable row level security;
alter table public.stock     enable row level security;
alter table public.takings   enable row level security;
alter table public.invoices  enable row level security;
alter table public.settings  enable row level security;
