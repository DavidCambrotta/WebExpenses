import { useState } from 'react'
import Nav from './components/Nav'
import Loading from './components/Loading'
import Overview from './pages/Overview'
import Monthly from './pages/Monthly'
import Categories from './pages/Categories'
import Compare from './pages/Compare'
import { useData } from './hooks/useData'

export default function App() {
  const [page, setPage] = useState('overview')
  const data = useData()

  if (data.loading || data.error) {
    return <Loading error={data.error} />
  }

  const pageProps = {
    years: data.years || [],
    yearTotals: data.yearTotals || {},
    monthlyTotals: data.monthlyTotals || {},
    categoryByYear: data.categoryByYear || {},
    monthlyByYearCategory: data.monthlyByYearCategory || {},
    rowsByYearMonth: data.rowsByYearMonth || {},
    yearIncomeTotal: data.yearIncomeTotal || {},
    income: data.income || [],
  }

  return (
    <div className="app">
      <Nav page={page} setPage={setPage} />
      <main className="main">
        {page === 'overview' && <Overview {...pageProps} />}
        {page === 'monthly' && <Monthly {...pageProps} />}
        {page === 'categories' && <Categories {...pageProps} />}
        {page === 'compare' && <Compare {...pageProps} />}
      </main>
    </div>
  )
}
