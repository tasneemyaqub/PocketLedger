import { useEffect, useMemo, useState } from "react"

import Sidebar from "../components/Sidebar"
import TransactionTable from "../components/TransactionTable"
import { transactionApi } from "../services/api"

function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  const [type, setType] = useState("all")
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
        <h1 className="text-3xl font-bold mb-6">
          Transactions
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <div className="flex justify-between gap-4">
            <input
              type="text"
              placeholder="Search transaction..."
              className="border p-3 rounded-lg w-72 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border p-3 rounded-lg outline-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
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
        />
      </div>
    </div>
  )
}

export default Transactions
