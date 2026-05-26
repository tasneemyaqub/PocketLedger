import { useState } from "react"

import Sidebar from "../components/Sidebar"
import SummaryCard from "../components/SummaryCard"
import TransactionForm from "../components/TransactionForm"
import TransactionTable from "../components/TransactionTable"

function Dashboard() {

  const [transactions, setTransactions] = useState([

    {
      title: "Groceries",
      amount: "- ₹2,000",
      category: "Food",
      date: "23 May",
    },

    {
      title: "Salary",
      amount: "+ ₹40,000",
      category: "Income",
      date: "20 May",
    },

  ])

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
            amount="₹25,000"
          />

          <SummaryCard
            title="Income"
            amount="₹40,000"
          />

          <SummaryCard
            title="Expenses"
            amount="₹10,000"
          />

        </div>

        <TransactionForm
          transactions={transactions}
          setTransactions={setTransactions}
        />

        <TransactionTable
          transactions={transactions}
        />

      </div>

    </div>
  )
}

export default Dashboard