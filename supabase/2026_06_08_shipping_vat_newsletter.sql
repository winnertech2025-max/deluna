alter table public.orders add column if not exists shipping_country text not null default 'NL';
alter table public.orders add column if not exists customer_type text not null default 'private';
alter table public.orders add column if not exists vat_number text;
alter table public.orders add column if not exists vat_exempt boolean not null default false;
alter table public.orders add column if not exists vat_amount numeric(10,2) not null default 0;
alter table public.orders add column if not exists shipping_amount numeric(10,2) not null default 0;
alter table public.orders add column if not exists newsletter_opt_in boolean not null default false;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text not null default 'website',
  locale text,
  consent boolean not null default true,
  consent_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Public can subscribe newsletter" on public.newsletter_subscribers;
create policy "Public can subscribe newsletter" on public.newsletter_subscribers
for insert with check (consent = true);

drop policy if exists "Admins manage newsletter subscribers" on public.newsletter_subscribers;
create policy "Admins manage newsletter subscribers" on public.newsletter_subscribers
for all using (public.is_admin()) with check (public.is_admin());
