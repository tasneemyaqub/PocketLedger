import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { authApi, setSession } from "../services/api"

function Login() {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const session = await authApi.login({
        mobile,
        password,
      })

      setSession(session)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">
          PocketLedger
        </h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >

          <input
            type="tel"
            placeholder="Enter phone number"
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            className="bg-emerald-500 text-white p-3 rounded-lg hover:bg-emerald-600 transition w-full disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-4 text-slate-600">

          Don’t have an account?

          <Link
            to="/register"
            className="text-emerald-500 ml-2 font-semibold"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login
