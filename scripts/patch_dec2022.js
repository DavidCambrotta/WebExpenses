/**
 * One-time patch: replaces all December 2022 data in Supabase.
 *
 * Run from project root:
 *   node -r dotenv/config scripts/patch_dec2022.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

function parseCSV(filePath) {
  const raw = fs.readFileSync(filePath)
  let content
  if (raw[0] === 0xFF && raw[1] === 0xFE) {
    content = raw.slice(2).toString('utf16le')
  } else if (raw[0] === 0xFE && raw[1] === 0xFF) {
    content = raw.slice(2).swap16().toString('utf16le')
  } else {
    content = raw.toString('utf-8')
  }
  content = content.replace(/\r/g, '')
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1)
  const lines   = content.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).filter((l) => l.trim()).map((line) => {
    const values = line.split(',')
    return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? '').trim()]))
  })
}

async function patch() {
  const expensesPath = path.join(__dirname, '../Excels/expenses_2022_dec_patch.csv')
  const incomePath   = path.join(__dirname, '../Excels/income_2022_dec_patch.csv')

  // ── Delete existing Dec 2022 expenses ──
  console.log('Deleting existing expenses for year=2022 month=12…')
  const { error: delExpErr, count: delExpCount } = await supabase
    .from('expenses')
    .delete({ count: 'exact' })
    .eq('year', 2022)
    .eq('month', 12)
  if (delExpErr) throw new Error(`Delete expenses failed: ${delExpErr.message}`)
  console.log(`  Deleted ${delExpCount ?? '?'} expense rows.`)

  // ── Delete existing Dec 2022 income ──
  console.log('Deleting existing income for year=2022 month=12…')
  const { error: delIncErr, count: delIncCount } = await supabase
    .from('income')
    .delete({ count: 'exact' })
    .eq('year', 2022)
    .eq('month', 12)
  if (delIncErr) throw new Error(`Delete income failed: ${delIncErr.message}`)
  console.log(`  Deleted ${delIncCount ?? '?'} income rows.`)

  // ── Insert patched expenses ──
  console.log('Reading expenses_2022_dec_patch.csv…')
  const rawExpenses = parseCSV(expensesPath)
  const expenseRows = rawExpenses.map((r) => ({
    date:        r.date,
    year:        parseInt(r.year),
    month:       parseInt(r.month),
    day:         parseInt(r.day),
    type:        r.type || 'variable',
    category:    r.category,
    subcategory: r.subcategory || null,
    amount:      parseFloat(r.amount),
    description: r.description || null,
  }))
  console.log(`Inserting ${expenseRows.length} expense rows…`)
  const { error: insExpErr } = await supabase.from('expenses').insert(expenseRows)
  if (insExpErr) throw new Error(`Insert expenses failed: ${insExpErr.message}`)

  // ── Insert patched income ──
  console.log('Reading income_2022_dec_patch.csv…')
  const rawIncome = parseCSV(incomePath)
  const incomeRows = rawIncome.map((r) => ({
    year:           parseInt(r.year),
    month:          parseInt(r.month),
    income:         parseFloat(r.income),
    total_expenses: parseFloat(r.total_expenses),
    profit:         parseFloat(r.profit),
  }))
  console.log(`Inserting ${incomeRows.length} income row(s)…`)
  const { error: insIncErr } = await supabase.from('income').insert(incomeRows)
  if (insIncErr) throw new Error(`Insert income failed: ${insIncErr.message}`)

  // ── Confirm row counts ──
  console.log('\nVerifying…')
  const { count: expCount, error: cntExpErr } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('year', 2022)
    .eq('month', 12)
  if (cntExpErr) throw new Error(`Count expenses failed: ${cntExpErr.message}`)

  const { count: incCount, error: cntIncErr } = await supabase
    .from('income')
    .select('*', { count: 'exact', head: true })
    .eq('year', 2022)
    .eq('month', 12)
  if (cntIncErr) throw new Error(`Count income failed: ${cntIncErr.message}`)

  console.log(`  expenses (2022-12): ${expCount} rows  (expected ${expenseRows.length})`)
  console.log(`  income   (2022-12): ${incCount} rows  (expected ${incomeRows.length})`)

  if (expCount !== expenseRows.length || incCount !== incomeRows.length) {
    throw new Error('Row count mismatch — check the data!')
  }

  console.log('\nPatch complete!')
}

patch().catch((err) => {
  console.error('\nPatch failed:', err.message)
  process.exit(1)
})
