-- Deluna Custom Studio - Supabase SQL Editor setup
-- Run this file in Supabase SQL Editor, then add your keys to .env.local.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.product_status as enum ('active', 'out_of_stock', 'draft');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum ('pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled');
exception when duplicate_object then null;
end $$;

alter type public.order_status add value if not exists 'waiting_for_shipping';
alter type public.order_status add value if not exists 'shipping';

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  needs_sizes boolean not null default false,
  sort_order int not null default 0
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text not null,
  image_url text not null,
  gallery_urls text[] not null default '{}',
  base_price numeric(10,2) not null,
  currency text not null default 'EUR',
  status public.product_status not null default 'active',
  is_best_seller boolean not null default false,
  rating numeric(2,1) not null default 4.8,
  sold_count int not null default 0,
  tags text[] not null default '{}',
  is_personalizable boolean not null default true,
  personalization_label text not null default 'Name, text, or initials',
  personalization_max_length int not null default 18,
  personalization_placement text not null,
  personalization_fonts text[] not null default array['Serif','Script','Modern','Minimal'],
  personalization_colors text[] not null default array['Champagne Gold','Soft Black','Ivory','Rose Nude'],
  delivery_days text not null default '10-14 business days',
  temu_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  stock int not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('DLN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address text not null,
  status public.order_status not null default 'pending',
  total_amount numeric(10,2) not null,
  currency text not null default 'EUR',
  payment_method text not null default 'cod' check (payment_method in ('cod', 'paypal')),
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  quantity int not null default 1,
  unit_price numeric(10,2) not null,
  engraving_text text,
  engraving_font text,
  engraving_color text,
  preview_url text,
  created_at timestamptz not null default now()
);

alter table public.categories add column if not exists needs_sizes boolean not null default false;
alter table public.products add column if not exists is_best_seller boolean not null default false;
alter table public.products add column if not exists rating numeric(2,1) not null default 4.8;
alter table public.products add column if not exists sold_count int not null default 0;
alter table public.products add column if not exists tags text[] not null default '{}';
alter table public.orders add column if not exists payment_method text not null default 'cod';
alter table public.orders add column if not exists tracking_number text;

create table if not exists public.returned_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  customer_email text not null,
  reason text not null,
  condition text not null,
  status text not null default 'received' check (status in ('received','inspecting','refund_pending','refunded','rejected')),
  refund_amount numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.returned_orders enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.admin_users
    where email = (select auth.jwt() ->> 'email')
  );
$$;

drop policy if exists "Public can read active categories" on public.categories;
create policy "Public can read active categories" on public.categories
for select using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products
for select using (status in ('active', 'out_of_stock'));

drop policy if exists "Public can read product variants" on public.product_variants;
create policy "Public can read product variants" on public.product_variants
for select using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage variants" on public.product_variants;
create policy "Admins manage variants" on public.product_variants
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
for select using ((select auth.uid()) = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles
for insert with check ((select auth.uid()) = id);

drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders" on public.orders
for select using ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "Anyone can create guest or user orders" on public.orders;
create policy "Anyone can create guest or user orders" on public.orders
for insert with check (true);

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders" on public.orders
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage returned orders" on public.returned_orders;
create policy "Admins manage returned orders" on public.returned_orders
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users read own order items" on public.order_items;
create policy "Users read own order items" on public.order_items
for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.user_id = (select auth.uid()) or public.is_admin())
  )
);

drop policy if exists "Anyone can create order items" on public.order_items;
create policy "Anyone can create order items" on public.order_items
for insert with check (true);

insert into public.admin_users (email)
values ('admin@deluna.local'), ('thangdev02@gmail.com')
on conflict (email) do nothing;

insert into public.categories (slug, name, sort_order)
values
  ('jewelry', 'Customized Jewelry', 1),
  ('bags', 'Customized Bags', 2),
  ('clothing', 'Customized Clothing', 3),
  ('hats', 'Customized Hats', 4),
  ('gifts', 'Personalized Gifts', 5),
  ('accessories', 'Accessories', 6)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

update public.categories set needs_sizes = true where slug = 'clothing';

with seed_products(slug, category_slug, name, description, image_url, base_price, placement) as (
  values
    ('engraved-heart-bracelet', 'jewelry', 'Engraved Heart Bracelet', 'A delicate bracelet with a polished charm for initials, names, or a short date.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80', 16.90, 'front charm'),
    ('nameplate-pendant-necklace', 'jewelry', 'Nameplate Pendant Necklace', 'A refined everyday necklace designed for a name, word, or meaningful initials.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80', 18.50, 'center pendant'),
    ('personalized-tote-bag', 'bags', 'Personalized Tote Bag', 'A clean canvas tote with embroidered name placement for daily use and gifting.', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80', 14.80, 'front lower corner'),
    ('custom-cosmetic-pouch', 'bags', 'Custom Cosmetic Pouch', 'A soft pouch for makeup or travel accessories with name embroidery.', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80', 11.60, 'front center'),
    ('custom-oversized-t-shirt', 'clothing', 'Custom Oversized T-Shirt', 'A soft minimal tee with a small text or initials print.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80', 13.50, 'left chest'),
    ('initial-baseball-cap', 'hats', 'Initial Baseball Cap', 'A clean cap with embroidered initials on the front.', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80', 10.90, 'front panel'),
    ('personalized-gift-box', 'gifts', 'Personalized Gift Box', 'A curated gift box finished with a custom name label.', 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80', 19.60, 'gift tag'),
    ('monogram-phone-case', 'accessories', 'Monogram Phone Case', 'A simple phone case with initials and soft neutral color options.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80', 8.70, 'case center')
)
insert into public.products (slug, category_id, name, description, image_url, gallery_urls, base_price, personalization_placement, is_best_seller, sold_count, tags, temu_reference)
select
  seed_products.slug,
  categories.id,
  seed_products.name,
  seed_products.description,
  seed_products.image_url,
  array[seed_products.image_url],
  seed_products.base_price,
  seed_products.placement,
  seed_products.category_slug in ('jewelry', 'bags', 'clothing'),
  120,
  array['Free personalization','Giftable'],
  'Marketplace-inspired customizable product seed. Replace with licensed supplier data in production.'
from seed_products
join public.categories on categories.slug = seed_products.category_slug
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image_url = excluded.image_url,
  base_price = excluded.base_price,
  personalization_placement = excluded.personalization_placement;

insert into public.product_variants (product_id, name, price, stock, is_default)
select products.id, 'Standard', products.base_price, 30, true
from public.products
where not exists (
  select 1 from public.product_variants
  where product_variants.product_id = products.id
);
