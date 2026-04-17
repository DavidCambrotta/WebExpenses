import { fmt } from '../lib/constants'

export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }} className="chart-tooltip-row">
          <span>{entry.name ?? entry.dataKey}:</span>
          <span>{fmt(entry.value)}</span>
        </p>
      ))}
    </div>
  )
}
