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
  const [selectedTransaction, setSelectedTransaction] = useState(null)

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

  const handleTransactionSaved = async () => {
    await loadTransactions()
    setSelectedTransaction(null)
  }

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

        <TransactionForm
          key={selectedTransaction?._id || "new-transaction"}
          selectedTransaction={selectedTransaction}
          transactions={transactions}
          onTransactionSaved={handleTransactionSaved}
          onCancelEdit={() => setSelectedTransaction(null)}
        />

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onEdit={setSelectedTransaction}
        />
      </div>
    </div>
  )
}

export default Dashboard
