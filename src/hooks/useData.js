import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'

export function useData() {
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        // Paginate to bypass Supabase server-side max_rows cap (default 1000)
        const PAGE = 1000
        let allExpenses = []
        let page = 0
        while (true) {
          const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('date')
            .range(page * PAGE, (page + 1) * PAGE - 1)
          if (error) throw error
          allExpenses = allExpenses.concat(data)
          if (data.length < PAGE) break
          page++
        }

        const { data: incData, error: incError } = await supabase
          .from('income')
          .select('*')
          .order('year')
          .order('month')
        if (incError) throw incError

        setExpenses(allExpenses)
        setIncome(incData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const derived = useMemo(() => {
    if (!expenses.length) return null

    const years = [...new Set(expenses.map((e) => e.year))].sort()

    // yearTotals: { 2019: 5000, ... }
    const yearTotals = {}
    // monthlyTotals: { 2019: { 1: 400, 2: 350, ... }, ... }
    const monthlyTotals = {}
    // categoryByYear: { 2019: { groceries: 500, ... }, ... }
    const categoryByYear = {}
    // monthlyByYearCategory: { 2019: { 1: { groceries: 50, ... }, ... }, ... }
    const monthlyByYearCategory = {}
    // raw rows per year+month for transaction list
    const rowsByYearMonth = {}
    // typeByYear: { 2019: { variable: 4000, fixed: 1000 }, ... }
    const typeByYear = {}
    // subcategoryByYearCategory: { 2019: { home: { rent: X, utilities: Y }, ... }, ... }
    const subcategoryByYearCategory = {}

    expenses.forEach((e) => {
      const { year, month, type, category, subcategory, amount } = e

      yearTotals[year] = (yearTotals[year] || 0) + amount

      if (!monthlyTotals[year]) monthlyTotals[year] = {}
      monthlyTotals[year][month] = (monthlyTotals[year][month] || 0) + amount

      if (!categoryByYear[year]) categoryByYear[year] = {}
      categoryByYear[year][category] = (categoryByYear[year][category] || 0) + amount

      if (!monthlyByYearCategory[year]) monthlyByYearCategory[year] = {}
      if (!monthlyByYearCategory[year][month]) monthlyByYearCategory[year][month] = {}
      monthlyByYearCategory[year][month][category] =
        (monthlyByYearCategory[year][month][category] || 0) + amount

      const key = `${year}-${month}`
      if (!rowsByYearMonth[key]) rowsByYearMonth[key] = []
      rowsByYearMonth[key].push(e)

      if (!typeByYear[year]) typeByYear[year] = {}
      const t = type || 'variable'
      typeByYear[year][t] = (typeByYear[year][t] || 0) + amount

      if (subcategory) {
        if (!subcategoryByYearCategory[year]) subcategoryByYearCategory[year] = {}
        if (!subcategoryByYearCategory[year][category]) subcategoryByYearCategory[year][category] = {}
        subcategoryByYearCategory[year][category][subcategory] =
          (subcategoryByYearCategory[year][category][subcategory] || 0) + amount
      }
    })

    // incomeByYearMonth: { '2019-1': { income, total_expenses, profit }, ... }
    const incomeByYearMonth = {}
    income.forEach((r) => {
      incomeByYearMonth[`${r.year}-${r.month}`] = r
    })

    // yearIncomeTotal: { 2019: 24000, ... } (sum of monthly income per year)
    const yearIncomeTotal = {}
    income.forEach((r) => {
      yearIncomeTotal[r.year] = (yearIncomeTotal[r.year] || 0) + r.income
    })

    return {
      years,
      yearTotals,
      monthlyTotals,
      categoryByYear,
      monthlyByYearCategory,
      rowsByYearMonth,
      incomeByYearMonth,
      yearIncomeTotal,
      typeByYear,
      subcategoryByYearCategory,
    }
  }, [expenses, income])

  return { expenses, income, loading, error, ...(derived || {}) }
}
