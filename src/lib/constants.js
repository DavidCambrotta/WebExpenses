export const CATEGORY_COLORS = {
  eating_out: '#FF6B6B',
  fuel: '#4ECDC4',
  grocery: '#45B7D1',
  hygiene: '#96CEB4',
  other: '#C9B8FF',
  outings: '#DDA0DD',
  travel: '#F0A500',
}

export const CATEGORY_LABELS = {
  eating_out: 'Alimentação',
  fuel: 'Combustível',
  grocery: 'Mercado',
  hygiene: 'Higiene',
  other: 'Outros',
  outings: 'Lazer',
  travel: 'Transporte',
}

export const CATEGORIES = Object.keys(CATEGORY_COLORS)

export const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export const YEAR_COLORS = {
  2019: '#6366F1',
  2020: '#F59E0B',
  2021: '#10B981',
}

export const fmt = (value) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value ?? 0)

export const round2 = (n) => Math.round((n || 0) * 100) / 100
