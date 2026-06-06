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
  payment_status text not null default 'pending',
  payment_reference text,
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
alter table public.orders add column if not exists payment_status text not null default 'pending';
alter table public.orders add column if not exists payment_reference text;
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
  ('kids', 'Kids Personalized', 4),
  ('hats', 'Customized Hats', 5),
  ('gifts', 'Personalized Gifts', 6),
  ('accessories', 'Accessories', 7)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

update public.categories set needs_sizes = true where slug = 'clothing';
update public.categories set needs_sizes = true where slug = 'kids';

-- Refresh supplier catalog. Orders stay intact; old product references on historical
-- order items become null through the existing foreign-key rules.
delete from public.product_variants;
delete from public.products;

with seed_products(slug, category_slug, name, description, image_url, base_price, placement) as (
  values
    ('custom-name-tote-bag', 'bags', 'Custom Name Tote Bag', 'A personalized everyday tote bag with custom name placement.', 'https://img.kwcdn.com/product/fancy/ae505b70-a362-4eac-932c-31b576ce21f0.jpg', 16.90, 'front center'),
    ('personalized-mini-shoulder-bag', 'bags', 'Personalized Mini Shoulder Bag', 'A compact bag with subtle custom initials or name detail.', 'https://img.kwcdn.com/product/fancy/ae4dfcf4-393f-416d-9cf1-a1c3b232fe42.jpg', 18.90, 'front flap'),
    ('custom-cosmetic-pouch', 'bags', 'Custom Cosmetic Pouch', 'A soft pouch for makeup or travel accessories with name customization.', 'https://img.kwcdn.com/product/fancy/5e4e9480-20a1-4450-9d4d-b2cda9fd812e.jpg', 12.90, 'front center'),
    ('personalized-chain-crossbody-bag', 'bags', 'Personalized Chain Crossbody Bag', 'A boutique-style crossbody bag with monogram customization.', 'https://img.kwcdn.com/product/fancy/63f750d5-6133-4a6b-9ee7-977df9bd9589.jpg', 22.90, 'front lower corner'),
    ('custom-travel-organizer-bag', 'bags', 'Custom Travel Organizer Bag', 'A practical organizer bag made personal with initials or short text.', 'https://img.kwcdn.com/product/fancy/a51c5e2c-23d8-47ae-80ca-1270198b7ffb.jpg', 15.90, 'front pocket'),
    ('personalized-everyday-handbag', 'bags', 'Personalized Everyday Handbag', 'A soft handbag with a clean custom name or monogram detail.', 'https://img.kwcdn.com/product/fancy/154f54f7-07f6-4947-b4d8-86601220da48.jpg', 24.90, 'front panel'),
    ('personalized-name-necklace', 'jewelry', 'Personalized Name Necklace', 'A custom necklace designed for a name, word or meaningful initials.', 'https://img.kwcdn.com/product/fancy/492fe046-85ec-438f-915b-fa085d70c13e.jpg', 14.90, 'center pendant'),
    ('custom-initial-bracelet', 'jewelry', 'Custom Initial Bracelet', 'A delicate bracelet with initials or short engraved text.', 'https://img.kwcdn.com/product/fancy/23472a28-32fb-4600-aa47-3c8b2478ba43.jpg', 12.90, 'front charm'),
    ('engraved-charm-necklace', 'jewelry', 'Engraved Charm Necklace', 'A refined charm necklace with personal engraving.', 'https://img.kwcdn.com/product/fancy/d0327194-4f1c-4718-a5fe-9990312508b3.jpg', 15.50, 'small charm'),
    ('custom-heart-pendant', 'jewelry', 'Custom Heart Pendant', 'A heart pendant personalized with a name or initials.', 'https://img.kwcdn.com/product/fancy/2331f4f0-4271-4dde-992c-9650a4d36fb0.jpg', 13.90, 'heart pendant'),
    ('personalized-statement-necklace', 'jewelry', 'Personalized Statement Necklace', 'A custom jewelry piece for gifting and everyday wear.', 'https://img.kwcdn.com/product/fancy/46107965-3b07-4a2d-b4c5-93c5406d2d7b.jpg', 17.90, 'center pendant'),
    ('personalized-gift-box', 'gifts', 'Personalized Gift Box', 'A custom gift box made personal with name, text or initials.', 'https://img.kwcdn.com/product/fancy/6d9821d9-9d30-4bf0-b96d-a70fa89d9f7d.jpg', 19.90, 'gift label'),
    ('custom-keepsake-gift', 'gifts', 'Custom Keepsake Gift', 'A thoughtful personalized keepsake for birthdays or special days.', 'https://img.kwcdn.com/product/fancy/a313f09b-3810-42df-929b-e3c031927725.jpg', 16.50, 'front plate'),
    ('personalized-decor-gift', 'gifts', 'Personalized Decor Gift', 'A decorative custom gift with name or message placement.', 'https://img.kwcdn.com/product/fancy/c9ccce5b-0f1b-4b37-89d7-67af8ec4b987.jpg', 21.90, 'front display'),
    ('custom-memory-gift', 'gifts', 'Custom Memory Gift', 'A personal gift item for emotional, giftable moments.', 'https://img.kwcdn.com/product/fancy/45399aff-9fb5-46fc-a16c-581df9e9270c.jpg', 18.90, 'front center'),
    ('kids-custom-name-set', 'kids', 'Kids Custom Name Set', 'A personalized item for children with name or initials.', 'https://img.kwcdn.com/product/open/a4eb8800026640d8b40881edaeb4ac06-goods.jpeg', 13.90, 'front center'),
    ('personalized-kids-outfit', 'kids', 'Personalized Kids Outfit', 'A custom children''s outfit with size options and text personalization.', 'https://img.kwcdn.com/product/open/ddfbf2ae878e4095b76f5f1a801e210d-goods.jpeg', 15.90, 'front chest'),
    ('kids-custom-gift-piece', 'kids', 'Kids Custom Gift Piece', 'A child-friendly custom item for gifts and everyday use.', 'https://img.kwcdn.com/product/fancy/market/ee2cfaa9-605f-40e6-9713-a25299daa7ee.jpg', 11.90, 'front label'),
    ('personalized-kids-accessory', 'kids', 'Personalized Kids Accessory', 'A custom accessory for children with name or initials.', 'https://img.kwcdn.com/product/fancy/debd2e53-18d8-429d-9f1a-953c731b99d6.jpg', 9.90, 'front detail'),
    ('kids-name-detail-item', 'kids', 'Kids Name Detail Item', 'A simple personalized product for children''s gifts.', 'https://img.kwcdn.com/product/fancy/46aee654-4471-4b2a-a00b-a40304feb91a.jpg', 10.90, 'front center'),
    ('custom-embroidered-cap', 'hats', 'Custom Embroidered Cap', 'A cap personalized with initials, name or short text.', 'https://img.kwcdn.com/product/fancy/bf195fa8-a957-4412-b590-5619fe5352b9.jpg', 10.90, 'front panel'),
    ('personalized-baseball-hat', 'hats', 'Personalized Baseball Hat', 'A clean baseball hat with embroidered custom text.', 'https://img.kwcdn.com/product/fancy/210bdd21-24e5-488f-b843-9fbb12d6a84e.jpg', 11.90, 'front panel'),
    ('custom-initial-hat', 'hats', 'Custom Initial Hat', 'A minimal hat for initials, names or tiny phrases.', 'https://img.kwcdn.com/product/fancy/ca34b0a0-c05a-40e4-b0ea-81db0143a9af.jpg', 9.90, 'front panel'),
    ('personalized-bucket-hat', 'hats', 'Personalized Bucket Hat', 'A custom bucket hat with subtle name detail.', 'https://img.kwcdn.com/product/fancy/8929ab3c-e26c-40b5-a150-7cbddb87ea63.jpg', 12.90, 'front brim'),
    ('custom-casual-hat', 'hats', 'Custom Casual Hat', 'A casual hat made personal with custom embroidery.', 'https://img.kwcdn.com/product/fancy/dc8a4b4d-cd1d-463f-afbd-ae6944b36908.jpg', 11.50, 'front panel'),
    ('custom-printed-t-shirt', 'clothing', 'Custom Printed T-Shirt', 'A custom tee with text, name or personal print placement.', 'https://img.kwcdn.com/product/fancy/611a2306-7f77-4c8a-a286-4396d3c5513a.jpg', 13.90, 'front chest'),
    ('personalized-casual-top', 'clothing', 'Personalized Casual Top', 'A soft clothing piece with size options and custom text.', 'https://img.kwcdn.com/product/open/f9dbf6a915c04fdba20c660655442a0b-goods.jpeg', 15.90, 'front center'),
    ('custom-name-shirt', 'clothing', 'Custom Name Shirt', 'A wearable custom shirt for names, initials or phrases.', 'https://img.kwcdn.com/product/fancy/ce6f8a31-2992-4c58-b0fc-99047e337b49.jpg', 14.90, 'front chest'),
    ('personalized-apparel-piece', 'clothing', 'Personalized Apparel Piece', 'A custom apparel item with print placement and size selection.', 'https://img.kwcdn.com/product/open/2ee983416fcb4067a814673c8fbaf873-goods.jpeg', 16.90, 'front center')
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
  'Imported from client Temu share links.'
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
