import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from 'recharts'
import ChartTooltip from '../components/ChartTooltip'
import {
  MONTH_NAMES, CATEGORIES, VARIABLE_CATEGORIES, FIXED_CATEGORIES,
  CATEGORY_LABELS, CATEGORY_COLORS, SUBCATEGORY_LABELS, fmt, round2,
} from '../lib/constants'

const RADIAN = Math.PI / 180
function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.04) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export default function Monthly({ years, monthlyByYearCategory, rowsByYearMonth }) {
  const [selectedYear, setSelectedYear] = useState(years?.[years.length - 1] ?? 2021)
  const [selectedMonth, setSelectedMonth] = useState(null)

  const isAllYears = selectedYear === 'all'

  const barData = MONTH_NAMES.map((name, i) => {
    const month = i + 1
    const entry = { name, month }
    CATEGORIES.forEach((cat) => {
      entry[cat] = isAllYears
        ? round2(years.reduce((s, y) => s + (monthlyByYearCategory[y]?.[month]?.[cat] ?? 0), 0))
        : round2(monthlyByYearCategory[selectedYear]?.[month]?.[cat])
    })
    return entry
  })

  const catData = selectedMonth
    ? CATEGORIES.map((cat) => {
        const value = isAllYears
          ? round2(years.reduce((s, y) => s + (monthlyByYearCategory[y]?.[selectedMonth]?.[cat] ?? 0), 0))
          : round2(monthlyByYearCategory[selectedYear]?.[selectedMonth]?.[cat] ?? 0)
        return { cat, name: CATEGORY_LABELS[cat], value }
      }).filter((d) => d.value > 0).sort((a, b) => b.value - a.value)
    : []

  const monthTotal = catData.reduce((s, d) => s + d.value, 0)

  const variableTotal = round2(catData.filter((d) => VARIABLE_CATEGORIES.includes(d.cat)).reduce((s, d) => s + d.value, 0))
  const fixedTotal = round2(catData.filter((d) => FIXED_CATEGORIES.includes(d.cat)).reduce((s, d) => s + d.value, 0))
  const splitData = [
    { name: 'Variable', value: variableTotal, color: '#3b82f6' },
    { name: 'Fixed', value: fixedTotal, color: '#6366f1' },
  ].filter((d) => d.value > 0)

  const top3 = catData.slice(0, 3)

  const transactions = selectedMonth && !isAllYears
    ? (rowsByYearMonth[`${selectedYear}-${selectedMonth}`] || []).sort((a, b) => a.date.localeCompare(b.date))
    : []

  return (
    <div className="page">
      <h1 className="page-title">Monthly Detail</h1>

      <div className="pill-group">
        {years.map((y) => (
          <button
            key={y}
            className={`pill ${selectedYear === y ? 'pill-active' : ''}`}
            onClick={() => { setSelectedYear(y); setSelectedMonth(null) }}
          >
            {y}
          </button>
        ))}
        <button
          className={`pill ${isAllYears ? 'pill-active' : ''}`}
          onClick={() => { setSelectedYear('all'); setSelectedMonth(null) }}
        >
          All Years
        </button>
      </div>

      <div className="card">
        <h2 className="card-title">
          Expenses by Month — {isAllYears ? 'All Years' : selectedYear}
        </h2>
        <p className="card-hint">Click a bar to view details for that month</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={barData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            onClick={(e) => e?.activePayload && setSelectedMonth(e.activePayload[0]?.payload?.month)}
            style={{ cursor: 'pointer' }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `€${v}`} tick={{ fontSize: 11 }} width={55} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            {CATEGORIES.map((cat) => (
              <Bar key={cat} dataKey={cat} name={CATEGORY_LABELS[cat]} stackId="a" fill={CATEGORY_COLORS[cat]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedMonth && (
        <>
          <div className="card">
            <div className="card-header-row">
              <h2 className="card-title">
                {MONTH_NAMES[selectedMonth - 1]}{isAllYears ? ' — All Years' : ` ${selectedYear}`}
              </h2>
              <span className="badge">{fmt(monthTotal)}</span>
              <button className="close-btn" onClick={() => setSelectedMonth(null)}>×</button>
            </div>
          </div>

          {top3.length > 0 && (
            <div className="stat-grid" style={{ gridTemplateColumns: `repeat(${top3.length}, 1fr)` }}>
              {top3.map((d, i) => (
                <div key={d.cat} className="stat-card" style={{ borderTop: `3px solid ${CATEGORY_COLORS[d.cat]}` }}>
                  <p className="stat-label">#{i + 1} {d.name}</p>
                  <p className="stat-value">{fmt(d.value)}</p>
                  <p className="stat-sub">
                    {monthTotal > 0 ? ((d.value / monthTotal) * 100).toFixed(1) : 0}% of total
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="two-col">
            <div className="card">
              <h2 className="card-title">Category Breakdown</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={catData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    labelLine={false}
                    label={renderPieLabel}
                  >
                    {catData.map((d) => (
                      <Cell key={d.cat} fill={CATEGORY_COLORS[d.cat]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h2 className="card-title">Variable vs Fixed</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={splitData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    labelLine={false}
                    label={renderPieLabel}
                  >
                    {splitData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
                {splitData.map((d) => (
                  <span key={d.name} className="stat-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                    {d.name}: {fmt(d.value)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!isAllYears && (
            <div className="card">
              <h2 className="card-title">Transactions</h2>
              {transactions.length === 0 ? (
                <p className="empty-text">No transactions for this month.</p>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th className="right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id}>
                          <td className="mono">{t.date}</td>
                          <td>
                            <span
                              className="cat-badge"
                              style={{ background: CATEGORY_COLORS[t.category] + '33', color: CATEGORY_COLORS[t.category] }}
                            >
                              {CATEGORY_LABELS[t.category] ?? t.category}
                              {t.subcategory ? ` · ${SUBCATEGORY_LABELS[t.subcategory] ?? t.subcategory}` : ''}
                            </span>
                          </td>
                          <td className="muted">{t.description || '—'}</td>
                          <td className="right mono">{fmt(t.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
