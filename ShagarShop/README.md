# ShagarShop

A marketplace web application built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**.

## Features

- **Landing page** — hero, categories, featured products
- **Shop** — browse, filter by category, search
- **Product details** — images, ratings, add to cart
- **Cart** — persist in localStorage, quantity updates, shipping estimate
- **Checkout** — demo order flow
- **Auth** — login & signup (demo, stored in localStorage)

## Getting started

```bash
bun install   # or: npm install
bun run dev   # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### `SIGABRT` / dev script crashes

If `npm run dev` fails with **signal SIGABRT**, your shell is likely using a broken
`/usr/local/bin/node` (old Homebrew Node). This project’s scripts use `scripts/next.sh`,
which runs Next via **Bun** when available, or a newer Node on your PATH.

Install Bun if needed:

```bash
curl -fsSL https://bun.sh/install | bash
```

Optional: remove or fix the old Node so `which node` points to v18+.

## Project structure

```
src/
  app/          # Pages (App Router)
  components/   # Header, Footer, ProductCard
  context/      # Cart & auth state
  lib/          # Products data & types
```

## Next steps

- PostgreSQL + Prisma for real data
- NextAuth or Clerk for production auth
- Stripe for payments
- Seller dashboard & multi-vendor listings
