const formatCurrency = (transaction) => {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(transaction.amount)

  return `${transaction.transactionType === "income" ? "+" : "-"} ${amount}`
}

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))

function TransactionTable({ transactions, isLoading = false }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        Recent Transactions
      </h2>

      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="pb-3">
              Note
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
          {isLoading && (
            <tr>
              <td
                className="py-6 text-center text-slate-500"
                colSpan="4"
              >
                Loading transactions...
              </td>
            </tr>
          )}

          {!isLoading && transactions.length === 0 && (
            <tr>
              <td
                className="py-6 text-center text-slate-500"
                colSpan="4"
              >
                No transactions yet.
              </td>
            </tr>
          )}

          {!isLoading && transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="border-b"
            >
              <td className="py-4">
                {transaction.note || "-"}
              </td>

              <td
                className={`py-4 ${
                  transaction.transactionType === "income"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(transaction)}
              </td>

              <td className="py-4">
                {transaction.category}
              </td>

              <td className="py-4">
                {formatDate(transaction.date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransactionTable
