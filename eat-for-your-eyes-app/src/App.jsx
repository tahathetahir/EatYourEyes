import { useEffect, useMemo, useState } from 'react'
import Nav from './components/Nav'
import TopBar from './components/TopBar'
import Home from './screens/Home'
import Foods from './screens/Foods'
import Suggestions from './screens/Suggestions'
import Intake from './screens/Intake'
import History from './screens/History'
import More from './screens/More'
import Login from './screens/Login'
import Survey from './screens/Survey'
import AboutAuthor from './screens/AboutAuthor'
import {
  loadLog,
  addLogEntry,
  removeLogEntry,
  totalForLog,
  pruneOldLogs,
  loadSettings,
  saveSettings,
} from './utils/storage'
import { dateKey } from './utils/dateUtils'
import { REFERENCE_UG } from './utils/nutrition'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UnitProvider } from './context/UnitContext'
import { I18nProvider, useI18n } from './i18n/I18nContext'

export default function App() {
  return (
    <I18nProvider>
      <UnitProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </UnitProvider>
    </I18nProvider>
  )
}

// The whole main app is one page with six screens swapped by state, rather
// than a routing library -- there is no URL the user needs to bookmark or
// share, and a simple "which screen is active" variable is easier for a
// first-time React reader to follow than a router's configuration.
function AppShell() {
  const { user, hasSurvey, isReady } = useAuth()
  const { t } = useI18n()
  const [activeScreen, setActiveScreen] = useState('home')
  const [todayEntries, setTodayEntries] = useState(() => loadLog())
  const [settings, setSettings] = useState(() => loadSettings())
  const [notificationPermission, setNotificationPermission] = useState(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported',
  )
  const [reminderMessage, setReminderMessage] = useState(null)

  // The food log and reminder settings are scoped per logged-in username
  // (see utils/storage.js) -- reload them whenever who is logged in
  // changes, so a second account on the same browser never sees the first
  // account's log.
  useEffect(() => {
    setTodayEntries(loadLog())
    setSettings(loadSettings())
  }, [user?.username])

  // Old logs are trimmed once per app load, not on every render.
  useEffect(() => {
    pruneOldLogs()
  }, [])

  const todayTotal = useMemo(() => totalForLog(todayEntries), [todayEntries])

  function handleAdd(food, quantity) {
    setTodayEntries(addLogEntry(food, quantity))
  }

  function handleRemove(entryId) {
    setTodayEntries(removeLogEntry(entryId))
  }

  function handleUpdateSettings(nextSettings) {
    setSettings(nextSettings)
    saveSettings(nextSettings)
  }

  function handleRequestPermission() {
    if (!('Notification' in window)) return
    Notification.requestPermission().then(setNotificationPermission)
  }

  // Checks, roughly once a minute, whether it is time for today's reminder.
  // Specification 7 requires the reminder to be suppressed once the trial
  // dose is already met -- checked here against the live today's total, not
  // a stored value, so it reacts immediately if the user logs a food after
  // the reminder time has already passed.
  useEffect(() => {
    function checkReminder() {
      const settingsNow = loadSettings()
      if (!settingsNow.reminderEnabled) return

      const now = new Date()
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const today = dateKey(now)
      const alreadyNotifiedToday = settingsNow.lastNotifiedDate === today
      const todayNow = totalForLog(loadLog(today))
      const doseAlreadyMet = todayNow >= REFERENCE_UG

      if (currentHHMM === settingsNow.reminderTime && !alreadyNotifiedToday && !doseAlreadyMet) {
        const message = "It's time to log today's food for Eat For Your Eyes."
        setReminderMessage(message)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Eat For Your Eyes', { body: message })
        }
        const updated = { ...settingsNow, lastNotifiedDate: today }
        saveSettings(updated)
        setSettings(updated)
      }
    }

    checkReminder()
    const intervalId = setInterval(checkReminder, 30_000)
    return () => clearInterval(intervalId)
  }, [])

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-base text-[var(--color-text-muted)]">{t('common.loading')}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <TopBar />
        <Login />
      </>
    )
  }

  if (!hasSurvey) {
    return (
      <>
        <TopBar />
        <Survey />
      </>
    )
  }

  return (
    <>
      <TopBar showUnitSwitcher />

      {reminderMessage && (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-3 bg-[var(--color-primary-dark)] px-4 py-3 text-base text-white print:hidden"
        >
          <span>{reminderMessage}</span>
          <button
            type="button"
            onClick={() => setReminderMessage(null)}
            className="min-h-11 min-w-11 font-semibold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <main className="mx-auto max-w-2xl pb-24">
        {activeScreen === 'home' && (
          <Home
            todayEntries={todayEntries}
            todayTotal={todayTotal}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onNavigate={setActiveScreen}
          />
        )}
        {activeScreen === 'foods' && <Foods onAdd={handleAdd} />}
        {activeScreen === 'suggestions' && <Suggestions onAdd={handleAdd} />}
        {activeScreen === 'intake' && <Intake todayTotal={todayTotal} />}
        {activeScreen === 'history' && <History />}
        {activeScreen === 'about' && <AboutAuthor />}
        {activeScreen === 'more' && (
          <More
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            notificationPermission={notificationPermission}
            onRequestPermission={handleRequestPermission}
          />
        )}
      </main>

      <div className="print:hidden">
        <Nav activeScreen={activeScreen} onNavigate={setActiveScreen} />
      </div>
    </>
  )
}
