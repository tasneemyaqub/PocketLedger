import Sidebar from "../components/Sidebar"

function Analytics() {
  return (

    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-6">
          Analytics
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm">

            <h2 className="text-slate-500 mb-2">
              Total Income
            </h2>

            <p className="text-3xl font-bold text-emerald-500">
              ₹40,000
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">

            <h2 className="text-slate-500 mb-2">
              Total Expenses
            </h2>

            <p className="text-3xl font-bold text-red-500">
              ₹10,000
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">

            <h2 className="text-slate-500 mb-2">
              Savings
            </h2>

            <p className="text-3xl font-bold text-blue-500">
              ₹30,000
            </p>

          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm h-96 flex items-center justify-center">

          <h2 className="text-2xl text-slate-400">
            Charts Coming Next 📊
          </h2>

        </div>

      </div>

    </div>

  )
}

export default Analytics