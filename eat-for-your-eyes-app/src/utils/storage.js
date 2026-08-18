// The food/nutrient log lives entirely in localStorage, on the user's own
// device, and is never sent to the server -- a deliberate decision kept
// even after accounts were added for login/survey/feedback (see
// CONTEXT.md "Technical decisions" and README.md). This file is the only
// place that talks to localStorage for the log, so if that decision ever
// changes, this is the one file that needs to change with it.

import { dateKey, lastNDateKeys } from './dateUtils'

// Mirrors AuthContext's AUTH_USER_KEY. Read directly rather than imported,
// since this file has to stay a plain utility (no React) -- see the note
// below on why the food log is keyed per-username at all.
const AUTH_USER_KEY = 'eatForYourEyes.authUser'
const LOG_PREFIX = 'eatForYourEyes.log.' // + username + '.' + date key
const SETTINGS_KEY = 'eatForYourEyes.settings'
const DAYS_TO_KEEP = 30 // specification 2: keep at least 30 days of history

// Accounts were added for login history, surveys, and feedback (see
// server/), but the food/nutrient log itself was deliberately kept
// local-only and never sent to the server -- see CONTEXT.md and README.md.
// Scoping the localStorage key by username just keeps two accounts on the
// same browser from seeing each other's logs; it has no effect on the
// "never transmitted" guarantee.
function currentUsername() {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) return 'anonymous'
  try {
    return JSON.parse(raw)?.username ?? 'anonymous'
  } catch {
    return 'anonymous'
  }
}

function logStorageKey(dayKey) {
  return `${LOG_PREFIX}${currentUsername()}.${dayKey}`
}

// ---- Daily food log ----------------------------------------------------
// Each day's log is stored as its own localStorage entry: a JSON array of
// entries like { id, foodId, name, serving, ugPerServing, quantity, loggedAt }.
// Storing the food's name/serving/ugPerServing alongside the id means old
// log entries still display correctly even if foods.json is edited later.

export function loadLog(key = dateKey()) {
  const raw = localStorage.getItem(logStorageKey(key))
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    // Corrupted or unexpected data -- treat as an empty log rather than
    // crashing the app.
    return []
  }
}

export function saveLog(entries, key = dateKey()) {
  localStorage.setItem(logStorageKey(key), JSON.stringify(entries))
}

export function addLogEntry(food, quantity, key = dateKey()) {
  const entries = loadLog(key)
  const entry = {
    id: `${food.id}-${Date.now()}`,
    foodId: food.id,
    name: food.name,
    serving: food.serving,
    ugPerServing: food.ugPerServing,
    quantity,
    loggedAt: new Date().toISOString(),
  }
  const next = [...entries, entry]
  saveLog(next, key)
  return next
}

export function removeLogEntry(entryId, key = dateKey()) {
  const next = loadLog(key).filter((entry) => entry.id !== entryId)
  saveLog(next, key)
  return next
}

// Total micrograms for one day's log, adjusted for each entry's quantity
// (specification 2.2 -- totals must adjust correctly for quantity).
export function totalForLog(entries) {
  return entries.reduce((sum, entry) => sum + entry.ugPerServing * entry.quantity, 0)
}

// Returns { "2026-08-09": 4200, "2026-08-10": 0, ... } for the last N days,
// oldest first. Used by the history chart and the 30-day list.
export function loadHistory(days = DAYS_TO_KEEP) {
  const keys = lastNDateKeys(days)
  const history = {}
  for (const key of keys) {
    history[key] = totalForLog(loadLog(key))
  }
  return history
}

// Deletes any log older than DAYS_TO_KEEP so localStorage does not grow
// forever. Safe to call on every app load.
export function pruneOldLogs() {
  const keepKeys = new Set(lastNDateKeys(DAYS_TO_KEEP))
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const storageKey = localStorage.key(i)
    if (!storageKey || !storageKey.startsWith(LOG_PREFIX)) continue
    // Keys look like "eatForYourEyes.log.<username>.<YYYY-MM-DD>" -- the
    // date is always the last 10 characters, regardless of what the
    // username contains.
    const day = storageKey.slice(-10)
    if (!keepKeys.has(day)) {
      localStorage.removeItem(storageKey)
    }
  }
}

// ---- Settings (reminder time, notification choice) ---------------------

const DEFAULT_SETTINGS = {
  reminderEnabled: false,
  reminderTime: '18:00',
  lastNotifiedDate: null, // dateKey of the last day a reminder actually fired
}

export function loadSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (!raw) return { ...DEFAULT_SETTINGS }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
