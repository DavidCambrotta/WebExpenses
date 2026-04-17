import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend,
} from 'recharts'
import ChartTooltip from '../components/ChartTooltip'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_COLORS, fmt, round2 } from '../lib/constants'

const RADIAN = Math.PI / 180
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.04) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  )
}

export default function Categories({ years, categoryByYear }) {
  const [selectedYear, setSelectedYear] = useState(years?.[years.length - 1] ?? 2021)

  const data = CATEGORIES.map((cat) => ({
    name: CATEGORY_LABELS[cat],
    cat,
    value: round2(categoryByYear[selectedYear]?.[cat]),
  }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="page">
      <h1 className="page-title">Categorias</h1>

      <div className="pill-group">
        {years.map((y) => (
          <button
            key={y}
            className={`pill ${selectedYear === y ? 'pill-active' : ''}`}
            onClick={() => setSelectedYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">Total por Categoria — {selectedYear}</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `€${v}`} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={88} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" name="Total" radius={[0, 3, 3, 0]}>
              {data.map((d) => (
                <Cell key={d.cat} fill={CATEGORY_COLORS[d.cat]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="two-col">
        <div className="card">
          <h2 className="card-title">Distribuição</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderLabel}
              >
                {data.map((d) => (
                  <Cell key={d.cat} fill={CATEGORY_COLORS[d.cat]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="card-title">Resumo {selectedYear}</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th className="right">Total</th>
                <th className="right">%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.cat}>
                  <td>
                    <span
                      className="cat-badge"
                      style={{
                        background: CATEGORY_COLORS[d.cat] + '33',
                        color: CATEGORY_COLORS[d.cat],
                      }}
                    >
                      {d.name}
                    </span>
                  </td>
                  <td className="right mono">{fmt(d.value)}</td>
                  <td className="right muted">{total > 0 ? ((d.value / total) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
              <tr className="table-total">
                <td>Total</td>
                <td className="right mono">{fmt(total)}</td>
                <td className="right">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
