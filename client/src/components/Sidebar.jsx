import { NavLink, useNavigate } from "react-router-dom"

import { clearSession, getUser } from "../services/api"

function Sidebar() {
  const navigate = useNavigate()
  const user = getUser()

  const handleLogout = () => {
    clearSession()
    navigate("/")
  }

  const navLinkClass = ({ isActive }) =>
    `block p-3 rounded-lg cursor-pointer hover:bg-slate-800 ${
      isActive ? "bg-slate-800" : ""
    }`

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

        <li>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/transactions" className={navLinkClass}>
            Transactions
          </NavLink>
        </li>

        <li>
          <NavLink to="/analytics" className={navLinkClass}>
            Analytics
          </NavLink>
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
