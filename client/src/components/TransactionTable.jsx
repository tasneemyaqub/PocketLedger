function TransactionTable({ transactions }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <h2 className="text-xl font-semibold mb-4">
        Recent Transactions
      </h2>

      <table className="w-full">

        <thead>

          <tr className="text-left border-b">

            <th className="pb-3">Title</th>
            <th className="pb-3">Amount</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Date</th>

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
  )
}

export default TransactionTable