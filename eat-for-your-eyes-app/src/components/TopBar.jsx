import { useI18n } from '../i18n/I18nContext'
import { useUnit } from '../context/UnitContext'

// Sticky header shown above every screen. The language switcher is always
// present (including on the login/survey screens, before anyone has an
// account) -- the unit switcher only makes sense once real numbers are on
// screen, so it is optional via a prop.
export default function TopBar({ showUnitSwitcher = false }) {
  const { t, language, setLanguage, languages } = useI18n()
  const { unit, setUnit, units } = useUnit()

  return (
    <header className="sticky top-0 z-20 border-b-2 border-[var(--color-primary-dark)] bg-[var(--color-primary)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] print:hidden">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="text-lg font-bold text-white">{t('topBar.title')}</p>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="sr-only">{t('topBar.languageLabel')}</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="min-h-11 rounded-lg border-2 border-[var(--color-primary-dark)] bg-white px-2 py-1 text-sm font-semibold text-[var(--color-text)]"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </label>

          {showUnitSwitcher && (
            <label className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="sr-only">{t('topBar.unitLabel')}</span>
              <select
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                className="min-h-11 rounded-lg border-2 border-[var(--color-primary-dark)] bg-white px-2 py-1 text-sm font-semibold text-[var(--color-text)]"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
    </header>
  )
}
