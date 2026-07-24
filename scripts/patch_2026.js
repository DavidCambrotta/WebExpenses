const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function parseCSV(filepath) {
  const lines = fs.readFileSync(filepath, 'utf8').replace(/^\uFEFF/, '').split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/\r/,''));
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/\r/,''));
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || '');
    return obj;
  });
}

async function run() {
  console.log('Deleting existing 2026 expenses...');
  const { error: delExpErr } = await supabase.from('expenses').delete().eq('year', 2026);
  if (delExpErr) throw new Error('Delete expenses failed: ' + delExpErr.message);
  console.log('  Done.');

  console.log('Deleting existing 2026 income...');
  const { error: delIncErr } = await supabase.from('income').delete().eq('year', 2026);
  if (delIncErr) throw new Error('Delete income failed: ' + delIncErr.message);
  console.log('  Done.');

  console.log('Reading expenses_2026_patch.csv...');
  const expenses = parseCSV('./Excels/expenses_2026_patch.csv');
  expenses.forEach(r => { r.year = +r.year; r.month = +r.month; r.day = +r.day; r.amount = +r.amount; });

  console.log(`Inserting ${expenses.length} expense rows...`);
  const { error: insExpErr } = await supabase.from('expenses').insert(expenses);
  if (insExpErr) throw new Error('Insert expenses failed: ' + insExpErr.message);
  console.log('  Done.');

  console.log('Reading income_2026_patch.csv...');
  const income = parseCSV('./Excels/income_2026_patch.csv');
  income.forEach(r => { r.year = +r.year; r.month = +r.month; r.income = +r.income; r.total_expenses = +r.total_expenses; r.profit = +r.profit; });

  console.log(`Inserting ${income.length} income rows...`);
  const { error: insIncErr } = await supabase.from('income').insert(income);
  if (insIncErr) throw new Error('Insert income failed: ' + insIncErr.message);
  console.log('  Done.');

  console.log('Verifying...');
  const { count: expCount } = await supabase.from('expenses').select('*', { count: 'exact', head: true }).eq('year', 2026);
  const { count: incCount } = await supabase.from('income').select('*', { count: 'exact', head: true }).eq('year', 2026);
  console.log(`  expenses (2026): ${expCount} rows (expected 278)`);
  console.log(`  income   (2026): ${incCount} rows (expected 6)`);
  if (expCount !== 278 || incCount !== 6) throw new Error('Row count mismatch!');
  console.log('Patch complete!');
}

run().catch(err => { console.error('Patch failed:', err.message); process.exit(1); });
