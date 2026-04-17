/**
 * Seed script — reads Excels/expenses.csv and Excels/income.csv,
 * clears existing data, and inserts fresh rows into Supabase.
 *
 * Run from project root:
 *   npm run seed
 *   (or: node -r dotenv/config scripts/seed.js)
 *
 * Requires .env with VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
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
  const content = fs.readFileSync(filePath, 'utf-8').replace(/\r/g, '')
  const lines   = content.trim().split('\n')
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? '').trim()]))
  })
}

async function seed() {
  const expensesPath = path.join(__dirname, '../Excels/expenses.csv')
  const incomePath   = path.join(__dirname, '../Excels/income.csv')

  // ── Expenses ──
  console.log('Reading expenses.csv…')
  const rawExpenses = parseCSV(expensesPath)
  const expenseRows = rawExpenses.map((r) => ({
    date:        r.date,
    year:        parseInt(r.year),
    month:       parseInt(r.month),
    day:         parseInt(r.day),
    category:    r.category,
    amount:      parseFloat(r.amount),
    description: r.description || null,
  }))

  console.log(`Clearing expenses table…`)
  const { error: delExpErr } = await supabase.from('expenses').delete().neq('id', 0)
  if (delExpErr) throw new Error(`Delete expenses failed: ${delExpErr.message}`)

  console.log(`Inserting ${expenseRows.length} expense rows…`)
  const CHUNK = 500
  for (let i = 0; i < expenseRows.length; i += CHUNK) {
    const chunk = expenseRows.slice(i, i + CHUNK)
    const { error } = await supabase.from('expenses').insert(chunk)
    if (error) throw new Error(`Insert expenses chunk failed: ${error.message}`)
    process.stdout.write(`  ${Math.min(i + CHUNK, expenseRows.length)}/${expenseRows.length}\r`)
  }
  console.log('  expenses done.               ')

  // ── Income ──
  console.log('Reading income.csv…')
  const rawIncome = parseCSV(incomePath)
  const incomeRows = rawIncome.map((r) => ({
    year:  parseInt(r.year),
    month: parseInt(r.month),
    renda: parseFloat(r.renda),
    algt:  parseFloat(r.algt),
    total: parseFloat(r.total),
  }))

  console.log(`Upserting ${incomeRows.length} income rows…`)
  const { error: incErr } = await supabase
    .from('income')
    .upsert(incomeRows, { onConflict: 'year,month' })
  if (incErr) throw new Error(`Upsert income failed: ${incErr.message}`)

  console.log('Seed complete!')
}

seed().catch((err) => {
  console.error('\nSeed failed:', err.message)
  process.exit(1)
})
