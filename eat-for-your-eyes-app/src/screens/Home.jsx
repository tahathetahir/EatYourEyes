import { useState } from 'react'
import foodData from '../data/foods.json'
import FoodRow from '../components/FoodRow'
import IntakeProgressBar from '../components/IntakeProgressBar'
import { formatPercent, percentOfReference } from '../utils/nutrition'
import { useUnit } from '../context/UnitContext'
import { useI18n } from '../i18n/I18nContext'

// The foods most worth showing as one-tap shortcuts: the highest-yield foods
// in the whole database. See CONTEXT.md "The shape of the data" -- only a
// handful of foods carry a meaningful amount, so surfacing those few here is
// more useful than a generic search box on the home screen.
const QUICK_ADD_FOODS = [...foodData.foods]
  .sort((a, b) => b.ugPerServing - a.ugPerServing)
  .slice(0, 6)

// The home screen. Everything a person needs most often -- today's total,
// logging a food, seeing the top foods -- is reachable here in one tap,
// satisfying the "3 taps from home" requirement by making home itself the
// first tap for most tasks.
export default function Home({ todayEntries, todayTotal, onAdd, onRemove, onNavigate }) {
  const [expandedFoodId, setExpandedFoodId] = useState(null)
  const { formatUg } = useUnit()
  const { t } = useI18n()

  return (
    <div className="space-y-6 px-4 py-6">
      <section aria-labelledby="today-heading" className="space-y-3">
        <h1 id="today-heading" className="text-3xl font-bold text-[var(--color-text)]">
          {t('home.title')}
        </h1>
        <p className="text-2xl font-semibold text-[var(--color-text)]">
          {formatUg(todayTotal)}
          <span className="ml-2 text-lg font-normal text-[var(--color-text-muted)]">
            {t('home.ofTrialDose', { percent: formatPercent(todayTotal) })}
          </span>
        </p>
        <IntakeProgressBar percent={percentOfReference(todayTotal)} />
        <button
          type="button"
          onClick={() => onNavigate('intake')}
          className="min-h-11 text-base font-semibold text-[var(--color-primary)] underline"
        >
          {t('home.whatDoesThisMean')}
        </button>
      </section>

      <section aria-labelledby="quick-add-heading" className="space-y-2">
        <h2 id="quick-add-heading" className="text-xl font-bold text-[var(--color-text)]">
          {t('home.quickAddHeading')}
        </h2>
        <p className="text-base text-[var(--color-text-muted)]">{t('home.quickAddDescription')}</p>
        <ul className="rounded-lg border border-[var(--color-border)] bg-white px-2">
          {QUICK_ADD_FOODS.map((food) => (
            <FoodRow
              key={food.id}
              food={food}
              isExpanded={expandedFoodId === food.id}
              onToggleExpand={setExpandedFoodId}
              onAdd={(f, quantity) => {
                onAdd(f, quantity)
                setExpandedFoodId(null)
              }}
            />
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onNavigate('foods')}
          className="min-h-11 text-base font-semibold text-[var(--color-primary)] underline"
        >
          {t('home.browseAll', { count: foodData.foods.length })}
        </button>
      </section>

      <section aria-labelledby="today-log-heading" className="space-y-2">
        <h2 id="today-log-heading" className="text-xl font-bold text-[var(--color-text)]">
          {t('home.loggedTodayHeading')}
        </h2>
        {todayEntries.length === 0 ? (
          <p className="text-base text-[var(--color-text-muted)]">{t('home.nothingLogged')}</p>
        ) : (
          <ul className="space-y-2">
            {todayEntries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3"
              >
                <span>
                  <span className="block font-semibold text-[var(--color-text)]">
                    {entry.quantity} &times; {entry.name}
                  </span>
                  <span className="block text-base text-[var(--color-text-muted)]">
                    {formatUg(entry.ugPerServing * entry.quantity)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(entry.id)}
                  className="min-h-11 min-w-11 rounded-lg px-3 text-base font-semibold text-[var(--color-primary-dark)] underline"
                >
                  {t('home.remove')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
