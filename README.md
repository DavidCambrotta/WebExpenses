# WebExpenses

Personal expense dashboard — track and visualize 7 years of spending data.

---

## Project Overview

A single-user web app for visualizing personal finances, built with React + Vite + Supabase + Recharts + TailwindCSS and deployed on Vercel. The database lives on Supabase (PostgreSQL). Data is loaded from Excel/CSV exports via a local seed script.

---

## Features

- **6 pages**: Overview, Monthly Detail, Categories, Compare Years, Income & Profit, Login
- **7 years of data**: 2019–2025
- **11 variable expense categories**: Groceries, Fuel, Transport, Health, Restaurants, Party, Vacations, Clothing, Tech, Car, Others
- **2 fixed expense categories**: Home (Rent + Utilities), Subscriptions
- **Auth**: Email/password authentication (single user)
- **Responsive**: works on desktop and mobile; installable as a PWA on iPhone via Safari
- **Design**: Modern Light (Style 2 — purple accent)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Recharts, TailwindCSS |
| Backend / DB / Auth | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel (auto-deploy from GitHub `main`) |

---

## Project Structure

```
WebExpenses/
├── src/
│   ├── pages/          # One file per route (Overview, Monthly, Categories, Compare, Income, Login)
│   ├── components/     # Shared UI (Nav, StatCard, ChartTooltip, Loading)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Supabase client setup
│   ├── App.jsx         # Router + auth guard
│   └── main.jsx        # Entry point
├── scripts/
│   ├── seed.js         # Loads expenses_v3.csv + income_v3.csv into Supabase
│   └── patch_dec2022.js # One-off data fix for December 2022
├── supabase/
│   └── schema.sql      # Database schema — run this once in Supabase SQL Editor
├── Excels/
│   ├── Despesas 20XX.xlsx   # Source Excel files per year
│   ├── expenses_v3.csv      # Current canonical expenses data
│   └── income_v3.csv        # Current canonical income data
├── public/             # Static assets (icons, manifest for PWA)
├── .env.example        # Environment variable template
└── vite.config.js
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is fine)

### Steps

1. **Clone the repo**

   ```bash
   git clone <repo-url>
   cd WebExpenses
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your values in `.env`:

   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   > `SUPABASE_SERVICE_ROLE_KEY` is only used by the seed script locally — never expose it in the browser or add it to Vercel.

4. **Run the Supabase schema**

   In the Supabase dashboard → **Database → SQL Editor**, paste and run the contents of `supabase/schema.sql`.

5. **Seed the database**

   ```bash
   npm run seed
   ```

6. **Run locally**

   ```bash
   npm run dev
   # → http://localhost:5173
   ```

---

## Data Pipeline

- Source Excel files live in `Excels/` (`Despesas 20XX.xlsx` per year).
- `expenses_v3.csv` and `income_v3.csv` (also in `Excels/`) are the canonical CSV files consumed by the seed script.
- **Seed script**: `npm run seed` — deletes all existing rows and re-inserts from the CSVs. Safe to run multiple times.
- **Patch scripts** in `scripts/` (e.g., `patch_dec2022.js`) handle one-off data corrections.

---

## Deployment

1. Push to the `main` branch — Vercel auto-deploys.
2. Add these two environment variables in **Vercel → Settings → Environment Variables**:

   | Variable | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

   > Do **not** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel — it is only needed locally for seeding.

Vercel auto-detects Vite and uses `npm run build` with output directory `dist`.

---

## iPhone Installation (PWA)

1. Open the Vercel app URL in **Safari**.
2. Tap the **Share** icon → **Add to Home Screen**.
3. The app installs as a standalone PWA with its own icon.
