const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Visão Geral',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'monthly',
    label: 'Detalhe Mensal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'categories',
    label: 'Categorias',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9l6 3" />
      </svg>
    ),
  },
  {
    id: 'compare',
    label: 'Comparar Anos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="20" x2="12" y2="4" />
        <path d="M6 10l6-6 6 6" />
        <path d="M6 20h12" />
      </svg>
    ),
  },
]

export default function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${page === item.id ? 'active' : ''}`}
          onClick={() => setPage(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
