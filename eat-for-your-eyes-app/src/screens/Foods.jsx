import { useMemo, useState } from 'react'
import foodData from '../data/foods.json'
import FoodRow from '../components/FoodRow'
import { useI18n } from '../i18n/I18nContext'

const CATEGORIES = ['All categories', ...new Set(foodData.foods.map((f) => f.category))]

// The food browsing screen (specification 1 / Stage 1).
//
// Design decision: rather than a plain alphabetical search box, the list
// defaults to "Meaningful sources only" -- hiding the 112 of 145 foods that
// carry under 5% of the trial dose per serving, per CONTEXT.md's guidance
// that this is more useful than surfacing everything equally. Nothing is
// hidden permanently: a toggle switches to "All foods" so the full,
// honestly-labelled database is always reachable, which matters because
// specification 1 requires all 120+ entries to be visible in the app, not
// just the noteworthy ones.
export default function Foods({ onAdd }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All categories')
  const [showAll, setShowAll] = useState(false)
  const [expandedFoodId, setExpandedFoodId] = useState(null)
  const { t } = useI18n()

  const filteredFoods = useMemo(() => {
    return [...foodData.foods]
      .filter((food) => showAll || food.tier !== 'Low')
      .filter((food) => category === 'All categories' || food.category === category)
      .filter((food) => food.name.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) => b.ugPerServing - a.ugPerServing)
  }, [query, category, showAll])

  return (
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-3xl font-bold text-[var(--color-text)]">{t('foods.title')}</h1>
      <p className="text-base text-[var(--color-text-muted)]">
        {t('foods.description', { count: foodData.meta.count, source: foodData.meta.source })}
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="food-search" className="mb-1 block font-semibold text-[var(--color-text)]">
            {t('foods.searchLabel')}
          </label>
          <input
            id="food-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('foods.searchPlaceholder')}
            className="min-h-11 w-full rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
          />
        </div>

        <div>
          <label htmlFor="food-category" className="mb-1 block font-semibold text-[var(--color-text)]">
            {t('foods.categoryLabel')}
          </label>
          <select
            id="food-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="min-h-11 w-full rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All categories' ? t('foods.allCategories') : cat}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="sr-only">{t('foods.whichToShow')}</legend>
          <label className="flex min-h-11 items-center gap-2 text-base text-[var(--color-text)]">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(event) => setShowAll(event.target.checked)}
              className="h-6 w-6 shrink-0"
            />
            {t('foods.showAllLabel')}
          </label>
        </fieldset>
      </div>

      <p className="text-base text-[var(--color-text-muted)]" aria-live="polite">
        {t(filteredFoods.length === 1 ? 'foods.showingCountSingular' : 'foods.showingCountPlural', {
          count: filteredFoods.length,
        })}
      </p>

      {filteredFoods.length === 0 ? (
        <p className="text-base text-[var(--color-text)]">{t('foods.noMatches')}</p>
      ) : (
        <ul className="rounded-lg border border-[var(--color-border)] bg-white px-2">
          {filteredFoods.map((food) => (
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
      )}
    </div>
  )
}
