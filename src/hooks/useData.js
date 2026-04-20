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
        const [expRes, incRes] = await Promise.all([
          supabase.from('expenses').select('*').order('date').limit(10000),
          supabase.from('income').select('*').order('year').order('month'),
        ])
        if (expRes.error) throw expRes.error
        if (incRes.error) throw incRes.error
        setExpenses(expRes.data || [])
        setIncome(incRes.data || [])
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
    // categoryByYear: { 2019: { eating_out: 500, ... }, ... }
    const categoryByYear = {}
    // monthlyByYearCategory: { 2019: { 1: { eating_out: 50, ... }, ... }, ... }
    const monthlyByYearCategory = {}
    // raw rows per year+month for transaction list
    const rowsByYearMonth = {}

    expenses.forEach((e) => {
      const { year, month, category, amount } = e

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
    })

    // incomeByYearMonth: { '2019-1': { renda, algt, total }, ... }
    const incomeByYearMonth = {}
    income.forEach((r) => {
      incomeByYearMonth[`${r.year}-${r.month}`] = r
    })

    // yearIncomeTotal: { 2019: 24000, ... }
    const yearIncomeTotal = {}
    income.forEach((r) => {
      yearIncomeTotal[r.year] = (yearIncomeTotal[r.year] || 0) + r.total
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
    }
  }, [expenses, income])

  return { expenses, income, loading, error, ...(derived || {}) }
}
