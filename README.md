# Deluna Custom Studio

Next.js storefront for personalized products: simple European-style design, custom product flow, AI preview placeholder, cart, checkout, customer auth, order tracking, and admin management.

## Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS 3.4.17
- React Icons
- Headless UI dependency ready for richer controls
- Supabase Auth + Postgres schema

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The app runs with seed data even before Supabase keys are configured.

## Default admin

Admin URL: `/admin`

Default credentials:

```text
admin@deluna.local
Deluna@2026
```

Change these in `.env.local`:

```env
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-strong-password
```

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Copy your Supabase URL and publishable key into `.env.local`.
5. Enable Google Auth in Supabase if you want Google login.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-or-secret-key
```

Never expose the service role / secret key to the browser. In newer Supabase projects, use a Secret API key starting with `sb_secret_...`; in legacy projects, use the service_role JWT starting with `eyJ...`.

## Main flows

- Customer browses personalized categories.
- Customer selects a product and variant.
- Customer enters name/text/initials, font, color, and generates a preview.
- Customer adds to cart or buys now.
- Customer confirms delivery details.
- Logged-in customers can keep order history; guest buyers can still place orders without profile history.
- Admin can view product management and mark products active or out of stock.

## AI preview note

`/api/preview` currently creates a deterministic visual mock preview by overlaying the customer text on the product image. Replace this route with your preferred AI image generation provider when production credentials are available.
