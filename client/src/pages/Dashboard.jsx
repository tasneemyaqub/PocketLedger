import { useEffect, useMemo, useState } from "react"

import Sidebar from "../components/Sidebar"
import SummaryCard from "../components/SummaryCard"
import TransactionForm from "../components/TransactionForm"
import TransactionTable from "../components/TransactionTable"
import { transactionApi } from "../services/api"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)

function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await transactionApi.list()
        setTransactions(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

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

  const handleTransactionCreated = (transaction) => {
    setTransactions((current) => [
      transaction,
      ...current,
    ])
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-6">
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

        <TransactionForm onTransactionCreated={handleTransactionCreated} />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default Dashboard
