function SummaryCard({ title, amount }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">

      <h2 className="text-slate-500 text-sm mb-2">
        {title}
      </h2>

      <p className="text-3xl font-bold text-slate-800">
        {amount}
      </p>

    </div>
  )
}

export default SummaryCard