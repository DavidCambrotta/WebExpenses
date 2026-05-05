import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, LineChart, Line, Cell, ReferenceLine,
} from 'recharts'
import ChartTooltip from '../components/ChartTooltip'
import { MONTH_NAMES, YEAR_COLORS, fmt, round2 } from '../lib/constants'

export default function Income({ years, yearTotals, yearIncomeTotal, monthlyTotals, incomeByYearMonth }) {
  const [selectedYear, setSelectedYear] = useState('all')

  const yearData = years.map((y) => {
    const income = round2(yearIncomeTotal[y] ?? 0)
    const expenses = round2(yearTotals[y] ?? 0)
    const profit = round2(income - expenses)
    const profitPct = income > 0 ? round2((profit / income) * 100) : 0
    return { year: y, income, expenses, profit, profitPct }
  })

  const lineData = MONTH_NAMES.map((name, i) => {
    const month = i + 1
    const entry = { name }
    if (selectedYear === 'all') {
      years.forEach((y) => {
        const rec = incomeByYearMonth[`${y}-${month}`]
        entry[y] = rec?.income != null ? round2(rec.income) : undefined
      })
    } else {
      const rec = incomeByYearMonth[`${selectedYear}-${month}`]
      entry.income = rec?.income != null ? round2(rec.income) : undefined
      entry.profit = entry.income != null
        ? round2(entry.income - (monthlyTotals[selectedYear]?.[month] ?? 0))
        : undefined
    }
    return entry
  })

  return (
    <div className="page">
      <h1 className="page-title">Income &amp; Profit</h1>

      <div className="stat-grid">
        {yearData.map(({ year, income, expenses, profit, profitPct }) => (
          <div key={year} className="stat-card" style={{ borderTop: `3px solid ${YEAR_COLORS[year]}` }}>
            <p className="stat-label">{year}</p>
            <p className="stat-value">{fmt(income)}</p>
            <p className="stat-sub">Expenses: {fmt(expenses)}</p>
            <p
              className="stat-sub"
              style={{ color: profit >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}
            >
              Profit: {fmt(profit)} ({profitPct >= 0 ? '+' : ''}{profitPct}%)
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">Income vs Expenses vs Profit — All Years</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} width={55} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[2, 2, 0, 0]} />
            <Bar dataKey="profit" name="Profit" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="card-title">
          {selectedYear === 'all'
            ? 'Monthly Income — All Years'
            : `Monthly Income & Profit — ${selectedYear}`}
        </h2>
        <div className="pill-group" style={{ marginBottom: 16 }}>
          {years.map((y) => (
            <button
              key={y}
              className={`pill ${selectedYear === y ? 'pill-active' : ''}`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
          <button
            className={`pill ${selectedYear === 'all' ? 'pill-active' : ''}`}
            onClick={() => setSelectedYear('all')}
          >
            All Years
          </button>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `€${v}`} tick={{ fontSize: 11 }} width={65} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#d1d5db" />
            {selectedYear === 'all'
              ? years.map((y) => (
                  <Line
                    key={y}
                    type="monotone"
                    dataKey={y}
                    name={String(y)}
                    stroke={YEAR_COLORS[y]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    connectNulls={false}
                  />
                ))
              : [
                  <Line key="income" type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} connectNulls={false} />,
                  <Line key="profit" type="monotone" dataKey="profit" name="Profit" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} connectNulls={false} />,
                ]}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="card-title">Profit % by Year</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={yearData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} width={55} />
            <Tooltip formatter={(v) => [`${v}%`, 'Profit %']} />
            <ReferenceLine y={0} stroke="#d1d5db" />
            <Bar dataKey="profitPct" name="Profit %" radius={[3, 3, 0, 0]}>
              {yearData.map(({ year, profitPct }) => (
                <Cell key={year} fill={profitPct >= 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
