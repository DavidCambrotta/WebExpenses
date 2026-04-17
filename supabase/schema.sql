-- ============================================================
-- WebExpenses — Supabase Schema
-- Run this in the Supabase SQL Editor (Database > SQL Editor)
-- ============================================================

-- Drop existing tables if re-running
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS income CASCADE;

-- ── Expenses ──────────────────────────────────────────────
CREATE TABLE expenses (
  id          BIGSERIAL PRIMARY KEY,
  date        DATE          NOT NULL,
  year        SMALLINT      NOT NULL,
  month       SMALLINT      NOT NULL CHECK (month BETWEEN 1 AND 12),
  day         SMALLINT      NOT NULL CHECK (day BETWEEN 1 AND 31),
  category    TEXT          NOT NULL,
  amount      NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  description TEXT
);

CREATE INDEX idx_expenses_year       ON expenses (year);
CREATE INDEX idx_expenses_year_month ON expenses (year, month);
CREATE INDEX idx_expenses_category   ON expenses (category);

-- ── Income ────────────────────────────────────────────────
CREATE TABLE income (
  id      BIGSERIAL PRIMARY KEY,
  year    SMALLINT      NOT NULL,
  month   SMALLINT      NOT NULL CHECK (month BETWEEN 1 AND 12),
  renda   NUMERIC(10,2) NOT NULL DEFAULT 0,  -- salary
  algt    NUMERIC(10,2) NOT NULL DEFAULT 0,  -- housing allowance
  total   NUMERIC(10,2) NOT NULL DEFAULT 0,
  UNIQUE (year, month)
);

CREATE INDEX idx_income_year ON income (year);

-- ── Row Level Security ────────────────────────────────────
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income   ENABLE ROW LEVEL SECURITY;

-- Public read-only access (anon key can SELECT)
CREATE POLICY "public_read_expenses"
  ON expenses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "public_read_income"
  ON income FOR SELECT
  TO anon
  USING (true);

-- Only the service role (seed script) can write
-- No additional INSERT/UPDATE policies needed — service role bypasses RLS by default
