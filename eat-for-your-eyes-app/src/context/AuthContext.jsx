import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest, getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

const AUTH_USER_KEY = 'eatForYourEyes.authUser'

function loadStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function storeUser(user) {
  if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(AUTH_USER_KEY)
}

// Everything about "who is logged in" lives here. Note what this does NOT
// do: it never touches the food/nutrient log (see src/utils/storage.js) --
// that stays local-only regardless of which account is signed in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadStoredUser())
  const [hasSurvey, setHasSurvey] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  // On load, if a token is saved, confirm it is still valid with the server
  // (a session may have been logged out or expired elsewhere) rather than
  // trusting the cached user indefinitely.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setIsReady(true)
      return
    }
    apiRequest('/auth/me', { auth: true })
      .then((data) => {
        setUser(data.user)
        storeUser(data.user)
        setHasSurvey(data.hasSurvey)
      })
      .catch(() => {
        setToken(null)
        storeUser(null)
        setUser(null)
      })
      .finally(() => setIsReady(true))
  }, [])

  async function register(username, password, language) {
    setError(null)
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { username, password, language },
    })
    setToken(data.token)
    storeUser(data.user)
    setUser(data.user)
    setHasSurvey(data.hasSurvey)
    return data
  }

  async function login(username, password) {
    setError(null)
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { username, password },
    })
    setToken(data.token)
    storeUser(data.user)
    setUser(data.user)
    setHasSurvey(data.hasSurvey)
    return data
  }

  async function logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST', auth: true })
    } catch {
      // Even if the server call fails (e.g. offline), still clear the
      // local session so the person is not stuck "logged in" on this device.
    }
    setToken(null)
    storeUser(null)
    setUser(null)
    setHasSurvey(false)
  }

  async function updateLanguage(language) {
    const data = await apiRequest('/auth/language', {
      method: 'PUT',
      auth: true,
      body: { language },
    })
    setUser(data.user)
    storeUser(data.user)
  }

  function markSurveyComplete() {
    setHasSurvey(true)
  }

  const value = {
    user,
    hasSurvey,
    isReady,
    error,
    register,
    login,
    logout,
    updateLanguage,
    markSurveyComplete,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
