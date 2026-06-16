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

function TransactionTable({ transactions, isLoading = false, onEdit }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-400">
            Ledger
          </p>

          <h2 className="text-2xl font-semibold text-slate-950">
            Recent Transactions
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-[720px] w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-6 py-3">
              Note
            </th>
            <th className="px-6 py-3">
              Amount
            </th>
            <th className="px-6 py-3">
              Category
            </th>
            <th className="px-6 py-3">
              Date
            </th>
            {onEdit && (
              <th className="px-6 py-3 text-right">
                Action
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr>
              <td
                className="px-6 py-8 text-center text-slate-500"
                colSpan={onEdit ? "5" : "4"}
              >
                Loading transactions...
              </td>
            </tr>
          )}

          {!isLoading && transactions.length === 0 && (
            <tr>
              <td
                className="px-6 py-8 text-center text-slate-500"
                colSpan={onEdit ? "5" : "4"}
              >
                No transactions yet.
              </td>
            </tr>
          )}

          {!isLoading && transactions.map((transaction) => (
            <tr
              key={transaction._id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
            >
              <td className="max-w-xs px-6 py-4">
                <p className="truncate font-medium text-slate-800">
                  {transaction.note || "No note added"}
                </p>
              </td>

              <td
                className={`px-6 py-4 font-semibold ${
                  transaction.transactionType === "income"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(transaction)}
              </td>

              <td className="px-6 py-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {transaction.category}
                </span>
              </td>

              <td className="px-6 py-4 text-slate-600">
                {formatDate(transaction.date)}
              </td>

              {onEdit && (
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => onEdit(transaction)}
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default TransactionTable
