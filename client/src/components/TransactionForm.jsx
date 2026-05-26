import { useState } from "react"

function TransactionForm({ transactions, setTransactions }) {

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("")
  const [date, setDate] = useState("")

  const handleSubmit = (e) => {

    e.preventDefault()

    const newTransaction = {
      title: title,

      amount:
        type === "Income"
          ? `+ ₹${amount}`
          : `- ₹${amount}`,

      category: type,

      date: date,
    }

    setTransactions([
      newTransaction,
      ...transactions,
    ])

    setTitle("")
    setAmount("")
    setType("")
    setDate("")
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
          placeholder="Transaction Title"
          className="border p-3 rounded-lg outline-none"

          value={title}

          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-3 rounded-lg outline-none"

          value={amount}

          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <select
          className="border p-3 rounded-lg outline-none"

          value={type}

          onChange={(e) =>
            setType(e.target.value)
          }
        >

          <option value="">
            Select Type
          </option>

          <option>
            Income
          </option>

          <option>
            Expense
          </option>

        </select>

        <input
          type="date"
          className="border p-3 rounded-lg outline-none"

          value={date}

          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <button
          className="bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 transition col-span-2"
        >
          Add Transaction
        </button>

      </form>

    </div>
  )
}

export default TransactionForm