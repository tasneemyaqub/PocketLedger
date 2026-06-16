import { useEffect, useMemo, useState } from "react"
import {
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

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTransactions()
  }, [])

  const summary = useMemo(() => {
    return transactions.reduce(
      (totals, transaction) => {
        const amount = Number(transaction.amount) || 0

        if (transaction.transactionType === "income") {
          totals.income += amount
        } else {
          totals.expenses += amount
        }

        totals.balance = totals.income - totals.expenses
        return totals
      },
      {
        balance: 0,
        income: 0,
        expenses: 0,
      },
    )
  }, [transactions])

  const categoryData = useMemo(() => {
    const categoryTotals = new Map()

    transactions.forEach((transaction) => {
      if (transaction.transactionType !== "expense") {
        return
      }

      const amount = Number(transaction.amount) || 0
      const category = transaction.category || "Uncategorized"
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount)
    })

    return [...categoryTotals.entries()]
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((first, second) => second.value - first.value)
  }, [transactions])

  const trendYear = new Date().getFullYear()

  const trendData = useMemo(() => {
    return MONTHS.map((month, monthIndex) => {
      const totals = transactions.reduce(
        (monthTotals, transaction) => {
          const date = toTransactionDate(transaction)

          if (
            Number.isNaN(date.getTime()) ||
            date.getFullYear() !== trendYear ||
            date.getMonth() !== monthIndex
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
  }, [transactions, trendYear])

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
            PocketLedger
          </p>

          <h1 className="text-3xl font-bold text-slate-950">
            Dashboard
          </h1>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Total Balance"
            amount={formatCurrency(summary.balance)}
          />

          <SummaryCard
            title="Income"
            amount={formatCurrency(summary.income)}
          />

          <SummaryCard
            title="Expenses"
            amount={formatCurrency(summary.expenses)}
          />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
                All expenses
              </p>

              <h2 className="text-2xl font-semibold text-slate-950">
                Expense Split
              </h2>
            </div>

            <div className="h-80">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-slate-500">
                  Loading chart...
                </div>
              ) : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={115}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
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
                  No expenses found yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
                {trendYear}
              </p>

              <h2 className="text-2xl font-semibold text-slate-950">
                Income vs Expenses
              </h2>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
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
        </div>
      </div>
    </div>
  )
}

export default Dashboard
