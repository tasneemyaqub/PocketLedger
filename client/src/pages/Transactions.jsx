import { useEffect, useMemo, useState } from "react"

import Sidebar from "../components/Sidebar"
import TransactionForm from "../components/TransactionForm"
import TransactionTable from "../components/TransactionTable"
import { transactionApi } from "../services/api"

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
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

  const handleTransactionSaved = async () => {
    await loadTransactions()
    setSelectedTransaction(null)
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesType = type === "all" || transaction.transactionType === type
      const query = search.toLowerCase()
      const matchesSearch =
        transaction.category.toLowerCase().includes(query) ||
        (transaction.note || "").toLowerCase().includes(query)

      return matchesType && matchesSearch
    })
  }, [search, transactions, type])

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
            PocketLedger
          </p>

          <h1 className="text-3xl font-bold text-slate-950">
            Transactions
          </h1>
        </div>

        <TransactionForm
          key={selectedTransaction?._id || "new-transaction"}
          selectedTransaction={selectedTransaction}
          transactions={transactions}
          onTransactionSaved={handleTransactionSaved}
          onCancelEdit={() => setSelectedTransaction(null)}
        />

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap justify-between gap-4">
            <input
              type="text"
              placeholder="Search transaction..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 md:w-80"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="all">
                All
              </option>

              <option value="income">
                Income
              </option>

              <option value="expense">
                Expense
              </option>
            </select>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <TransactionTable
          transactions={filteredTransactions}
          isLoading={isLoading}
          onEdit={setSelectedTransaction}
        />
      </div>
    </div>
  )
}

export default Transactions
