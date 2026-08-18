import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from './translations/en'
import ur from './translations/ur'

const TRANSLATIONS = { en, ur }
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'اردو' },
]

const LANGUAGE_KEY = 'eatForYourEyes.language'

function loadStoredLanguage() {
  const stored = localStorage.getItem(LANGUAGE_KEY)
  return TRANSLATIONS[stored] ? stored : 'en'
}

function getAtPath(obj, path) {
  return path.split('.').reduce((node, part) => (node == null ? node : node[part]), obj)
}

function interpolate(template, vars) {
  if (!vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  )
}

const I18nContext = createContext(null)

// A small hand-rolled i18n layer rather than a library -- the app only
// needs flat key lookup, {{variable}} interpolation, and a language
// switch, which is little enough code to read and trust directly.
export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => loadStoredLanguage())

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr'
  }, [language])

  function setLanguage(nextLanguage) {
    if (!TRANSLATIONS[nextLanguage]) return
    setLanguageState(nextLanguage)
    localStorage.setItem(LANGUAGE_KEY, nextLanguage)
  }

  const value = useMemo(() => {
    function t(key, vars) {
      const current = getAtPath(TRANSLATIONS[language], key)
      const fallback = getAtPath(TRANSLATIONS.en, key)
      const template = current ?? fallback ?? key
      return interpolate(template, vars)
    }
    return { language, setLanguage, t, languages: SUPPORTED_LANGUAGES }
  }, [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
