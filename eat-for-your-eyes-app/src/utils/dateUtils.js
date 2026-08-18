// Small date helpers used across the app. Kept in one file so every screen
// formats and keys dates the same way.

// Turns a Date object into the "YYYY-MM-DD" string we use as a localStorage
// key. Using a fixed format (instead of toString()) means the key is always
// sortable and never depends on the browser's locale settings.
export function dateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Returns an array of "YYYY-MM-DD" keys for the last `count` days, oldest
// first, including today. Used to build the 7-day chart and the 30-day
// history list.
export function lastNDateKeys(count, from = new Date()) {
  const keys = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(from)
    d.setDate(d.getDate() - i)
    keys.push(dateKey(d))
  }
  return keys
}

// Turns "2026-08-15" into "Sat 15 Aug" for display. Short and unambiguous,
// and does not require a date-formatting library. `locale` lets callers
// match the app's current language (e.g. "ur-PK") rather than always
// falling back to the browser's own language.
export function formatShortDate(key, locale = undefined) {
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// "3:45 PM" style formatting for the reminder time picker's live preview.
export function formatTime(hhmm, locale = undefined) {
  if (!hhmm) return ''
  const [hours, minutes] = hhmm.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })
}

// Maps an app language code to a full BCP-47 locale for the Intl calls
// above -- kept in one place so History.jsx and More.jsx agree on it.
export function localeForLanguage(language) {
  return language === 'ur' ? 'ur-PK' : 'en-US'
}
