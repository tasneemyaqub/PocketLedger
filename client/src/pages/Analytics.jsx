import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import Sidebar from "../components/Sidebar"
import SummaryCard from "../components/SummaryCard"
import { transactionApi } from "../services/api"

const COLORS = [
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#64748b",
]

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)

const toTransactionDate = (transaction) => new Date(transaction.date)

const isSameMonth = (date, year, month) =>
  date.getFullYear() === year && date.getMonth() === month

const isSameYear = (date, year) => date.getFullYear() === year

function Analytics() {
  const [transactions, setTransactions] = useState([])
  const [period, setPeriod] = useState("monthly")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true)

      try {
        const data = await transactionApi.list()
        setTransactions(data)
        setError("")
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const years = useMemo(() => {
    const transactionYears = transactions
      .map((transaction) => toTransactionDate(transaction).getFullYear())
      .filter(Boolean)

    return [...new Set([new Date().getFullYear(), ...transactionYears])].sort(
      (first, second) => second - first,
    )
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const date = toTransactionDate(transaction)

      if (Number.isNaN(date.getTime())) {
        return false
      }

      return period === "monthly"
        ? isSameMonth(date, selectedYear, selectedMonth)
        : isSameYear(date, selectedYear)
    })
  }, [period, selectedMonth, selectedYear, transactions])

  const analytics = useMemo(() => {
    const totals = {
      income: 0,
      expenses: 0,
      transactionCount: filteredTransactions.length,
    }
    const categoryTotals = new Map()

    filteredTransactions.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0

      if (transaction.transactionType === "income") {
        totals.income += amount
        return
      }

      totals.expenses += amount

      const category = transaction.category || "Uncategorized"
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount)
    })

    const categoryData = [...categoryTotals.entries()]
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((first, second) => second.value - first.value)

    return {
      ...totals,
      balance: totals.income - totals.expenses,
      categoryData,
      biggestCategory: categoryData[0],
    }
  }, [filteredTransactions])

  const trendData = useMemo(() => {
    return MONTHS.map((month, monthIndex) => {
      const totals = transactions.reduce(
        (monthTotals, transaction) => {
          const date = toTransactionDate(transaction)

          if (
            Number.isNaN(date.getTime()) ||
            !isSameMonth(date, selectedYear, monthIndex)
          ) {
            return monthTotals
          }

          const amount = Number(transaction.amount) || 0

          if (transaction.transactionType === "income") {
            monthTotals.income += amount
          } else {
            monthTotals.expenses += amount
          }

          return monthTotals
        },
        {
          income: 0,
          expenses: 0,
        },
      )

      return {
        month,
        ...totals,
      }
    })
  }, [selectedYear, transactions])

  const averageExpense =
    period === "yearly" ? analytics.expenses / 12 : analytics.expenses
  const periodLabel =
    period === "monthly"
      ? `${MONTHS[selectedMonth]} ${selectedYear}`
      : String(selectedYear)

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              PocketLedger
            </p>

            <h1 className="text-3xl font-bold text-slate-950">
              Analytics
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              <option value="monthly">
                Monthly
              </option>

              <option value="yearly">
                Yearly
              </option>
            </select>

            {period === "monthly" && (
              <select
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(Number(event.target.value))}
              >
                {MONTHS.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            )}

            <select
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <SummaryCard title="Income" amount={formatCurrency(analytics.income)} />
          <SummaryCard title="Expenses" amount={formatCurrency(analytics.expenses)} />
          <SummaryCard title="Balance" amount={formatCurrency(analytics.balance)} />
          <SummaryCard
            title={period === "yearly" ? "Monthly Avg Expense" : "Period Expense"}
            amount={formatCurrency(averageExpense)}
          />
        </div>

        <div className="mb-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
                  {periodLabel}
                </p>

                <h2 className="text-2xl font-semibold text-slate-950">
                  Expense Split
                </h2>
              </div>

              <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {analytics.transactionCount} transactions
              </p>
            </div>

            <div className="h-80">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-slate-500">
                  Loading analytics...
                </div>
              ) : analytics.categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={115}
                      paddingAngle={3}
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-slate-500">
                  No expenses found for this period.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
              Category ranking
            </p>

            <h2 className="mb-5 text-2xl font-semibold text-slate-950">
              Top Expenses
            </h2>

            <div className="space-y-4">
              {analytics.categoryData.length > 0 ? (
                analytics.categoryData.slice(0, 5).map((category, index) => {
                  const percentage =
                    analytics.expenses > 0
                      ? (category.value / analytics.expenses) * 100
                      : 0

                  return (
                    <div key={category.name}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-800">
                          {category.name}
                        </span>

                        <span className="text-sm font-semibold text-slate-600">
                          {formatCurrency(category.value)}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  Add expenses with category tags to see your largest spending areas.
                </p>
              )}
            </div>

            {analytics.biggestCategory && (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-700">
                  Biggest category
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {analytics.biggestCategory.name} at{" "}
                  {formatCurrency(analytics.biggestCategory.value)}
                </p>
              </div>
            )}
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
              {selectedYear}
            </p>

            <h2 className="mb-5 text-2xl font-semibold text-slate-950">
              Income vs Expenses
            </h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
              {periodLabel}
            </p>

            <h2 className="mb-5 text-2xl font-semibold text-slate-950">
              Category Comparison
            </h2>

            <div className="h-80">
              {analytics.categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categoryData.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {analytics.categoryData.slice(0, 8).map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-center text-slate-500">
                  No category data for this period.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Analytics
