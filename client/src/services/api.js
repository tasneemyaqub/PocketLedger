const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const getToken = () => localStorage.getItem("pocketledger_token")

const setSession = ({ token, user }) => {
  localStorage.setItem("pocketledger_token", token)
  localStorage.setItem("pocketledger_user", JSON.stringify(user))
}

const clearSession = () => {
  localStorage.removeItem("pocketledger_token")
  localStorage.removeItem("pocketledger_user")
}

const getUser = () => {
  const user = localStorage.getItem("pocketledger_user")
  return user ? JSON.parse(user) : null
}

const request = async (path, options = {}) => {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

export const authApi = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
}

export const transactionApi = {
  list: () => request("/transactions"),
  create: (payload) =>
    request("/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/transactions/${id}`, {
      method: "DELETE",
    }),
}

export { clearSession, getToken, getUser, setSession }
