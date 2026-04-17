import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import ChartTooltip from '../components/ChartTooltip'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, YEAR_COLORS, fmt, round2 } from '../lib/constants'

export default function Compare({ years, categoryByYear, yearTotals }) {
  const [yearA, setYearA] = useState(years?.[0] ?? 2019)
  const [yearB, setYearB] = useState(years?.[years.length - 1] ?? 2021)

  const barData = CATEGORIES.map((cat) => ({
    name: CATEGORY_LABELS[cat],
    cat,
    [yearA]: round2(categoryByYear[yearA]?.[cat]),
    [yearB]: round2(categoryByYear[yearB]?.[cat]),
  })).sort((a, b) => {
    const sumA = (a[yearA] || 0) + (a[yearB] || 0)
    const sumB = (b[yearA] || 0) + (b[yearB] || 0)
    return sumB - sumA
  })

  const tableData = CATEGORIES.map((cat) => {
    const a = round2(categoryByYear[yearA]?.[cat])
    const b = round2(categoryByYear[yearB]?.[cat])
    const diff = round2(b - a)
    const pct = a > 0 ? ((b - a) / a) * 100 : null
    return { cat, name: CATEGORY_LABELS[cat], a, b, diff, pct }
  }).sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff))

  const totalA = round2(yearTotals[yearA] || 0)
  const totalB = round2(yearTotals[yearB] || 0)
  const totalDiff = round2(totalB - totalA)
  const totalPct = totalA > 0 ? ((totalB - totalA) / totalA) * 100 : null

  return (
    <div className="page">
      <h1 className="page-title">Comparar Anos</h1>

      <div className="compare-selectors">
        <div className="selector-group">
          <label>Ano A</label>
          <div className="pill-group">
            {years.map((y) => (
              <button
                key={y}
                className={`pill ${yearA === y ? 'pill-active' : ''}`}
                style={yearA === y ? { background: YEAR_COLORS[y], borderColor: YEAR_COLORS[y] } : {}}
                onClick={() => setYearA(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
        <div className="selector-group">
          <label>Ano B</label>
          <div className="pill-group">
            {years.map((y) => (
              <button
                key={y}
                className={`pill ${yearB === y ? 'pill-active' : ''}`}
                style={yearB === y ? { background: YEAR_COLORS[y], borderColor: YEAR_COLORS[y] } : {}}
                onClick={() => setYearB(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card" style={{ borderTop: `3px solid ${YEAR_COLORS[yearA]}` }}>
          <p className="stat-label">Total {yearA}</p>
          <p className="stat-value">{fmt(totalA)}</p>
        </div>
        <div className="stat-card" style={{ borderTop: `3px solid ${YEAR_COLORS[yearB]}` }}>
          <p className="stat-label">Total {yearB}</p>
          <p className="stat-value">{fmt(totalB)}</p>
        </div>
        <div className="stat-card" style={{ borderTop: `3px solid ${totalDiff > 0 ? '#ef4444' : '#22c55e'}` }}>
          <p className="stat-label">Variação</p>
          <p className="stat-value" style={{ color: totalDiff > 0 ? '#ef4444' : '#22c55e' }}>
            {totalDiff > 0 ? '+' : ''}{fmt(totalDiff)}
          </p>
          {totalPct !== null && (
            <p className="stat-sub" style={{ color: totalDiff > 0 ? '#ef4444' : '#22c55e' }}>
              {totalDiff > 0 ? '+' : ''}{totalPct.toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Categorias: {yearA} vs {yearB}</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis tickFormatter={(v) => `€${v}`} tick={{ fontSize: 11 }} width={55} />
            <Tooltip content={<ChartTooltip />} />
            <Legend verticalAlign="top" />
            <Bar dataKey={yearA} name={String(yearA)} fill={YEAR_COLORS[yearA]} radius={[2, 2, 0, 0]} />
            <Bar dataKey={yearB} name={String(yearB)} fill={YEAR_COLORS[yearB]} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="card-title">Resumo por Categoria</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th className="right">{yearA}</th>
                <th className="right">{yearB}</th>
                <th className="right">Diferença</th>
                <th className="right">Variação %</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.cat}>
                  <td>
                    <span
                      className="cat-badge"
                      style={{
                        background: CATEGORY_COLORS[row.cat] + '33',
                        color: CATEGORY_COLORS[row.cat],
                      }}
                    >
                      {row.name}
                    </span>
                  </td>
                  <td className="right mono">{fmt(row.a)}</td>
                  <td className="right mono">{fmt(row.b)}</td>
                  <td
                    className="right mono"
                    style={{ color: row.diff > 0 ? '#ef4444' : row.diff < 0 ? '#22c55e' : undefined }}
                  >
                    {row.diff > 0 ? '+' : ''}{fmt(row.diff)}
                  </td>
                  <td
                    className="right"
                    style={{ color: row.diff > 0 ? '#ef4444' : row.diff < 0 ? '#22c55e' : undefined }}
                  >
                    {row.pct !== null ? `${row.diff > 0 ? '+' : ''}${row.pct.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
              <tr className="table-total">
                <td>Total</td>
                <td className="right mono">{fmt(totalA)}</td>
                <td className="right mono">{fmt(totalB)}</td>
                <td
                  className="right mono"
                  style={{ color: totalDiff > 0 ? '#ef4444' : '#22c55e' }}
                >
                  {totalDiff > 0 ? '+' : ''}{fmt(totalDiff)}
                </td>
                <td
                  className="right"
                  style={{ color: totalDiff > 0 ? '#ef4444' : '#22c55e' }}
                >
                  {totalPct !== null ? `${totalDiff > 0 ? '+' : ''}${totalPct.toFixed(1)}%` : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
