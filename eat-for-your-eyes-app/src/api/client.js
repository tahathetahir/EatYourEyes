// The one place that knows how to reach the backend. In development, Vite's
// dev server proxies "/api" to the local backend (see vite.config.js), so a
// relative path works. A packaged build (e.g. wrapped with Capacitor for the
// Play Store) has no dev server to proxy through, so VITE_API_BASE_URL lets
// the build point at wherever the backend is actually deployed -- see
// README.md "Packaging for the Play Store".
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const TOKEN_KEY = 'eatForYourEyes.authToken'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiRequest(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error ?? `Request failed (${response.status}).`)
  }
  return data
}
