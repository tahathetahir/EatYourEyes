import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'

export default function Login() {
  const { login, register } = useAuth()
  const { t, language, setLanguage, languages } = useI18n()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        await register(username, password, language)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">{t('topBar.title')}</h1>
        <p className="text-base text-[var(--color-text-muted)]">{t('auth.tagline')}</p>
      </div>

      <div role="group" aria-label="Log in or create account" className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('login')}
          aria-pressed={mode === 'login'}
          className={`min-h-11 flex-1 rounded-lg border-2 px-4 py-2 text-base font-semibold ${
            mode === 'login'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] bg-white text-[var(--color-text)]'
          }`}
        >
          {t('auth.loginTab')}
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          aria-pressed={mode === 'register'}
          className={`min-h-11 flex-1 rounded-lg border-2 px-4 py-2 text-base font-semibold ${
            mode === 'register'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
              : 'border-[var(--color-border)] bg-white text-[var(--color-text)]'
          }`}
        >
          {t('auth.registerTab')}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-4">
        <div>
          <label htmlFor="login-username" className="mb-1 block font-semibold text-[var(--color-text)]">
            {t('auth.usernameLabel')}
          </label>
          <input
            id="login-username"
            type="text"
            autoComplete="username"
            required
            minLength={3}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="min-h-11 w-full rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-1 block font-semibold text-[var(--color-text)]">
            {t('auth.passwordLabel')}
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-11 w-full rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="login-language" className="mb-1 block font-semibold text-[var(--color-text)]">
              {t('auth.languageLabel')}
            </label>
            <select
              id="login-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="min-h-11 w-full rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-[var(--color-bg-alt)] p-3 text-base text-[var(--color-text)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 w-full rounded-lg bg-[var(--color-primary)] px-4 py-2 text-base font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? t('common.loading') : mode === 'login' ? t('auth.submitLogin') : t('auth.submitRegister')}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="min-h-11 w-full text-base font-semibold text-[var(--color-primary)] underline"
        >
          {mode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
        </button>
      </form>

      <p className="text-center text-base text-[var(--color-text-muted)]">{t('auth.privacyNote')}</p>
    </div>
  )
}
