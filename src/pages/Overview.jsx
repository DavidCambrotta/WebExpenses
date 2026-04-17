import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import StatCard from '../components/StatCard'
import ChartTooltip from '../components/ChartTooltip'
import { MONTH_NAMES, YEAR_COLORS, CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, fmt, round2 } from '../lib/constants'

export default function Overview({ years, yearTotals, monthlyTotals, categoryByYear, yearIncomeTotal }) {
  // Line chart: monthly totals per year
  const lineData = MONTH_NAMES.map((name, i) => {
    const month = i + 1
    const entry = { name }
    years.forEach((y) => {
      entry[y] = round2(monthlyTotals[y]?.[month])
    })
    return entry
  })

  // Grouped bar: category totals per year
  const catData = CATEGORIES.map((cat) => {
    const entry = { name: CATEGORY_LABELS[cat], cat }
    years.forEach((y) => {
      entry[y] = round2(categoryByYear[y]?.[cat])
    })
    return entry
  }).sort((a, b) => {
    const sumA = years.reduce((s, y) => s + (a[y] || 0), 0)
    const sumB = years.reduce((s, y) => s + (b[y] || 0), 0)
    return sumB - sumA
  })

  return (
    <div className="page">
      <h1 className="page-title">Visão Geral</h1>

      <div className="stat-grid">
        {years.map((y) => (
          <StatCard
            key={y}
            label={`Total ${y}`}
            value={fmt(yearTotals[y])}
            sub={yearIncomeTotal[y] ? `Renda: ${fmt(yearIncomeTotal[y])}` : undefined}
            accent={YEAR_COLORS[y]}
          />
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">Despesas Mensais por Ano</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `€${v}`} tick={{ fontSize: 11 }} width={55} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            {years.map((y) => (
              <Line
                key={y}
                type="monotone"
                dataKey={y}
                name={String(y)}
                stroke={YEAR_COLORS[y]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="card-title">Total por Categoria e Ano</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={catData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
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
            {years.map((y) => (
              <Bar key={y} dataKey={y} name={String(y)} fill={YEAR_COLORS[y]} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
