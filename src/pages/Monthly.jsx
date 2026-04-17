import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import ChartTooltip from '../components/ChartTooltip'
import { MONTH_NAMES, CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, fmt, round2 } from '../lib/constants'

export default function Monthly({ years, monthlyByYearCategory, rowsByYearMonth }) {
  const [selectedYear, setSelectedYear] = useState(years?.[years.length - 1] ?? 2021)
  const [selectedMonth, setSelectedMonth] = useState(null)

  const barData = MONTH_NAMES.map((name, i) => {
    const month = i + 1
    const entry = { name, month }
    CATEGORIES.forEach((cat) => {
      entry[cat] = round2(monthlyByYearCategory[selectedYear]?.[month]?.[cat])
    })
    return entry
  })

  const transactions = selectedMonth
    ? (rowsByYearMonth[`${selectedYear}-${selectedMonth}`] || []).sort((a, b) =>
        a.date.localeCompare(b.date)
      )
    : []

  const monthTotal = selectedMonth
    ? Object.values(monthlyByYearCategory[selectedYear]?.[selectedMonth] || {}).reduce(
        (s, v) => s + v,
        0
      )
    : 0

  return (
    <div className="page">
      <h1 className="page-title">Detalhe Mensal</h1>

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
      </div>

      <div className="card">
        <h2 className="card-title">Despesas por Mês — {selectedYear}</h2>
        <p className="card-hint">Clique em uma barra para ver as transações do mês</p>
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
              <Bar
                key={cat}
                dataKey={cat}
                name={CATEGORY_LABELS[cat]}
                stackId="a"
                fill={CATEGORY_COLORS[cat]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedMonth && (
        <div className="card">
          <div className="card-header-row">
            <h2 className="card-title">
              {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </h2>
            <span className="badge">{fmt(monthTotal)}</span>
            <button className="close-btn" onClick={() => setSelectedMonth(null)}>×</button>
          </div>
          {transactions.length === 0 ? (
            <p className="empty-text">Nenhuma transação neste mês.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th className="right">Valor</th>
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
    </div>
  )
}
