export const VARIABLE_CATEGORIES = [
  'groceries', 'fuel', 'transport', 'health', 'restaurants',
  'party', 'vacations', 'cloths', 'tech', 'car', 'others',
]

export const FIXED_CATEGORIES = ['home', 'subscriptions']

export const CATEGORIES = [...VARIABLE_CATEGORIES, ...FIXED_CATEGORIES]

export const CATEGORY_COLORS = {
  groceries:     '#45B7D1',
  fuel:          '#4ECDC4',
  transport:     '#F0A500',
  health:        '#96CEB4',
  restaurants:   '#FF6B6B',
  party:         '#DDA0DD',
  vacations:     '#F59E0B',
  cloths:        '#EC4899',
  tech:          '#8B5CF6',
  car:           '#F97316',
  others:        '#C9B8FF',
  home:          '#6366F1',
  subscriptions: '#10B981',
}

export const CATEGORY_LABELS = {
  groceries:     'Groceries',
  fuel:          'Fuel',
  transport:     'Transport',
  health:        'Health',
  restaurants:   'Restaurants',
  party:         'Party',
  vacations:     'Vacations',
  cloths:        'Clothing',
  tech:          'Tech',
  car:           'Car',
  others:        'Others',
  home:          'Home',
  subscriptions: 'Subscriptions',
}

export const SUBCATEGORY_LABELS = {
  rent:      'Rent',
  utilities: 'Utilities',
  phone:     'Phone',
  gym:       'Gym',
  icloud:    'iCloud',
}

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const YEAR_COLORS = {
  2019: '#6366f1',
  2020: '#f59e0b',
  2021: '#10b981',
  2022: '#3b82f6',
  2023: '#ef4444',
  2024: '#8b5cf6',
  2025: '#f97316',
}

export const fmt = (value) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value ?? 0)

export const round2 = (n) => Math.round((n || 0) * 100) / 100
