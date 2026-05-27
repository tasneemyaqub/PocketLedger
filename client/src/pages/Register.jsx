import { Link } from "react-router-dom"

function Register() {
  return (
    <div className="h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h1 className="text-3xl font-bold text-center mb-6 text-slate-800">
          Create Account
        </h1>

        <form className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Enter name"
            className="border p-3 rounded-lg outline-none"
          />

          <input
            type="tel"
            placeholder="Enter phone number"
            className="border p-3 rounded-lg outline-none"
          />

          <input
            type="password"
            placeholder="Enter password"
            className="border p-3 rounded-lg outline-none"
          />

          <Link to="/dashboard">

            <button
              className="bg-emerald-500 text-white p-3 rounded-lg w-full"
            >
              Register
            </button>

          </Link>

        </form>

        <p className="text-center mt-4 text-slate-600">

          Already have an account?

          <Link
            to="/"
            className="text-emerald-500 ml-2 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Register