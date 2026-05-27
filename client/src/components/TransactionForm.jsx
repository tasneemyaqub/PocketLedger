import { useState } from "react"

import { transactionApi } from "../services/api"

function TransactionForm({ onTransactionCreated }) {
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("")
  const [category, setCategory] = useState("")
  const [note, setNote] = useState("")
  const [date, setDate] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const newTransaction = await transactionApi.create({
        amount: Number(amount),
        transactionType: type,
        category,
        note,
        ...(date ? { date } : {}),
      })

      onTransactionCreated(newTransaction)

      setAmount("")
      setType("")
      setCategory("")
      setNote("")
      setDate("")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Add Transaction
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Category"
          className="border p-3 rounded-lg outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-3 rounded-lg outline-none"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />

        <select
          className="border p-3 rounded-lg outline-none"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="">
            Select Type
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        <input
          type="text"
          placeholder="Note"
          className="border p-3 rounded-lg outline-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <input
          type="date"
          className="border p-3 rounded-lg outline-none"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {error && (
          <p className="col-span-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          className="bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 transition col-span-2 disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  )
}

export default TransactionForm
