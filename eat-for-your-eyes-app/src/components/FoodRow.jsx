import TierBadge from './TierBadge'
import QuantityPicker from './QuantityPicker'
import { formatPercent } from '../utils/nutrition'
import { useUnit } from '../context/UnitContext'
import { useI18n } from '../i18n/I18nContext'

// One row in the food list: name, serving, µg, tier -- and, when tapped,
// an inline quantity picker to log it. Used on the Foods screen and for
// Home's quick-add shortcuts, so the "add a food" behaviour is identical
// everywhere in the app.
export default function FoodRow({ food, isExpanded, onToggleExpand, onAdd }) {
  const { formatUg } = useUnit()
  const { t } = useI18n()

  return (
    <li className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => onToggleExpand(food.id)}
        aria-expanded={isExpanded}
        className="flex min-h-11 w-full items-center justify-between gap-3 py-3 text-left"
      >
        <span className="flex-1">
          <span className="block font-semibold text-[var(--color-text)]">{food.name}</span>
          <span className="block text-base text-[var(--color-text-muted)]">
            {t('foodRow.summary', {
              serving: food.serving,
              amount: formatUg(food.ugPerServing),
              percent: formatPercent(food.ugPerServing),
            })}
          </span>
        </span>
        <TierBadge tier={food.tier} />
      </button>

      {isExpanded && (
        <div className="pb-4">
          <QuantityPicker
            food={food}
            onConfirm={(quantity) => onAdd(food, quantity)}
            onCancel={() => onToggleExpand(null)}
          />
        </div>
      )}
    </li>
  )
}
