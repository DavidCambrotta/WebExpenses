# WebExpenses

Personal expense dashboard — React + Supabase + Recharts.

Tracks spending across 2019–2021 with four views: overview, monthly detail, categories breakdown, and year comparison.

---

## Stack

- **Frontend**: React 18, Vite, Recharts
- **Backend**: Supabase (PostgreSQL + RLS)
- **Deploy**: Vercel

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Database → SQL Editor**, paste the contents of `supabase/schema.sql`, and run it.
3. In **Settings → API** copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY` *(seed script only — never expose in browser)*

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

---

## Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

---

## Seed Data

Place your CSV files in `Excels/`:

| File | Columns |
|------|---------|
| `Excels/expenses.csv` | `date, year, month, day, category, amount, description` |
| `Excels/income.csv` | `year, month, renda, algt, total` |

Then run:

```bash
npm run seed
```

The script deletes existing rows and re-inserts everything. Safe to run multiple times.

---

## Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project in [vercel.com](https://vercel.com/new).
3. Add the two `VITE_` environment variables in **Settings → Environment Variables** (the `SUPABASE_SERVICE_KEY` is only needed locally for seeding — do **not** add it to Vercel).
4. Click **Deploy**.

Vercel auto-detects Vite and sets `npm run build` + output dir `dist`.

---

## Category Labels

| key | Portuguese |
|-----|-----------|
| `eating_out` | Alimentação |
| `fuel` | Combustível |
| `grocery` | Mercado |
| `hygiene` | Higiene |
| `other` | Outros |
| `outings` | Lazer |
| `travel` | Transporte |
