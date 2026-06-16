import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { clearSession, getUser } from "../services/api"

function Sidebar() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    clearSession()
    navigate("/")
  }

  return (

    <div className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-10 text-emerald-400">
        PocketLedger
      </h1>

      {user && (
        <p className="mb-8 text-sm text-slate-300">
          {user.name}
        </p>
      )}

      <ul className="space-y-4">

        <Link to="/dashboard">

          <li className="bg-slate-800 p-3 rounded-lg cursor-pointer hover:bg-slate-700">
            Dashboard
          </li>

        </Link>

        <Link to="/transactions">

          <li className="p-3 rounded-lg cursor-pointer hover:bg-slate-800">
            Transactions
          </li>

        </Link>

        <li className="p-3 rounded-lg cursor-pointer hover:bg-slate-800">
          Analytics
        </li>

        <li
          className="p-3 rounded-lg cursor-pointer hover:bg-slate-800"
          onClick={handleLogout}
        >
          Logout
        </li>

      </ul>

    </div>

  )
}

export default Sidebar
