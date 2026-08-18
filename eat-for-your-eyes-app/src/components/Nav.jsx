import { useI18n } from '../i18n/I18nContext'

// The bottom navigation bar. It is the only way to move between screens, so
// every screen is exactly one tap away from every other screen -- this is
// what keeps every core task within the 3-tap limit from the home screen
// (accessibility requirement in CONTEXT.md).
const TABS = [
  { id: 'home', labelKey: 'nav.home', symbol: '⌂' },
  { id: 'foods', labelKey: 'nav.foods', symbol: '⚲' },
  { id: 'suggestions', labelKey: 'nav.suggestions', symbol: '✦' },
  { id: 'history', labelKey: 'nav.history', symbol: '▤' },
  { id: 'about', labelKey: 'nav.about', symbol: '★' },
  { id: 'more', labelKey: 'nav.more', symbol: '≡' },
]

export default function Nav({ activeScreen, onNavigate }) {
  const { t } = useI18n()

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-[var(--color-primary-dark)] bg-[var(--color-primary)] shadow-[0_-2px_8px_rgba(0,0,0,0.15)]"
    >
      <ul className="mx-auto flex max-w-2xl list-none justify-between gap-1 px-2 py-2">
        {TABS.map((tab) => {
          const isActive = activeScreen === tab.id
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-xs font-semibold text-white sm:text-sm ${
                  isActive ? 'bg-white !text-[var(--color-primary)] shadow-sm' : ''
                }`}
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  {tab.symbol}
                </span>
                {t(tab.labelKey)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
