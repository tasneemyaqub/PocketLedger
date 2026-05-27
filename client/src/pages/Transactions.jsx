import Sidebar from "../components/Sidebar"

function Transactions() {

  const transactions = [

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

    {
      title: "Electricity Bill",
      amount: "- ₹3,000",
      category: "Bills",
      date: "18 May",
    },

    {
      title: "Netflix",
      amount: "- ₹500",
      category: "Entertainment",
      date: "15 May",
    },

  ]

  return (

    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-6">
          Transactions
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <div className="flex justify-between mb-4">

            <input
              type="text"
              placeholder="Search transaction..."
              className="border p-3 rounded-lg w-72 outline-none"
            />

            <select className="border p-3 rounded-lg outline-none">

              <option>
                All
              </option>

              <option>
                Income
              </option>

              <option>
                Expense
              </option>

            </select>

          </div>

          <table className="w-full">

            <thead>

              <tr className="text-left border-b">

                <th className="pb-3">
                  Title
                </th>

                <th className="pb-3">
                  Amount
                </th>

                <th className="pb-3">
                  Category
                </th>

                <th className="pb-3">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {transactions.map((transaction, index) => (

                <tr
                  key={index}
                  className="border-b"
                >

                  <td className="py-4">
                    {transaction.title}
                  </td>

                  <td
                    className={`py-4 ${
                      transaction.amount.includes("+")
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.amount}
                  </td>

                  <td className="py-4">
                    {transaction.category}
                  </td>

                  <td className="py-4">
                    {transaction.date}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  )
}

export default Transactions