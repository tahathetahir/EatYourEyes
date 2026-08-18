import { useMemo, useState } from 'react'
import { MEAL_SUGGESTIONS } from '../data/suggestions'
import { getMealFoods, getMealTotalUg } from '../utils/suggestionMath'
import { formatPercent } from '../utils/nutrition'
import { useUnit } from '../context/UnitContext'
import { useI18n } from '../i18n/I18nContext'

const FILTERS = [
  { id: 'all', labelKey: 'suggestions.filterAll' },
  { id: 'vegan', labelKey: 'suggestions.filterVegan' },
  { id: 'vegetarian', labelKey: 'suggestions.filterVegetarian' },
]

// The meal suggestions screen (specification 4 / Stage 4). Every µg figure
// here is calculated live from foods.json via getMealTotalUg -- nothing is
// typed in as a fixed number, so these totals can never drift from the
// database they claim to be based on.
export default function Suggestions({ onAdd }) {
  const [filter, setFilter] = useState('all')
  const { formatUg } = useUnit()
  const { t } = useI18n()

  const visibleSuggestions = useMemo(() => {
    if (filter === 'all') return MEAL_SUGGESTIONS
    return MEAL_SUGGESTIONS.filter((meal) => meal.tags.includes(filter))
  }, [filter])

  return (
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-3xl font-bold text-[var(--color-text)]">{t('suggestions.title')}</h1>
      <p className="text-base text-[var(--color-text-muted)]">{t('suggestions.description')}</p>

      <div role="group" aria-label={t('suggestions.filterGroupLabel')} className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`min-h-11 rounded-full border-2 px-4 py-2 text-base font-semibold ${
              filter === f.id
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-border)] bg-white text-[var(--color-text)]'
            }`}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {visibleSuggestions.map((meal) => {
          const totalUg = getMealTotalUg(meal)
          const foods = getMealFoods(meal)
          const reachesHalfDose = totalUg >= 6000
          return (
            <li
              key={meal.id}
              className="space-y-2 rounded-lg border border-[var(--color-border)] bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-xl font-bold text-[var(--color-text)]">{meal.name}</h2>
                <span className="flex gap-1">
                  {meal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] px-3 py-1 text-sm font-semibold text-[var(--color-text)]"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
              <p className="text-base text-[var(--color-text)]">{meal.description}</p>
              <p className="font-semibold text-[var(--color-text)]">
                {t('suggestions.totalLabel', { total: formatUg(totalUg), percent: formatPercent(totalUg) })}
                {reachesHalfDose && (
                  <span className="ml-2 rounded-full bg-[var(--color-tier-excellent)] px-2 py-0.5 text-sm font-semibold text-white">
                    {t('suggestions.halfDoseBadge')}
                  </span>
                )}
              </p>
              <ul className="text-base text-[var(--color-text-muted)]">
                {foods.map((food) => (
                  <li key={food.id}>
                    {food.name} ({food.serving}) &mdash; {formatUg(food.ugPerServing)}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-1">
                {foods.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => onAdd(food, 1)}
                    className="min-h-11 rounded-lg border-2 border-[var(--color-primary)] px-3 py-2 text-base font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    {t('suggestions.logServing', { name: food.name })}
                  </button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
