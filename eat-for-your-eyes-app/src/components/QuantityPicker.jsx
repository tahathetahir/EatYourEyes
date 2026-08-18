// An inline panel (not a popup dialog) for choosing how many servings of a
// food to log, then confirming. Kept as a plain expanding panel rather than
// a modal overlay -- one less thing to explain (no focus-trapping) and one
// less thing that can go visually wrong on a small screen.
import { useI18n } from '../i18n/I18nContext'

const QUANTITIES = [0.5, 1, 2, 3]

export default function QuantityPicker({ food, onConfirm, onCancel }) {
  const { t } = useI18n()
  return (
    <div className="rounded-lg border-2 border-[var(--color-primary)] bg-[var(--color-bg-alt)] p-4">
      <p className="mb-3 font-semibold text-[var(--color-text)]">
        {t('quantityPicker.howMany', { name: food.name })}
      </p>
      <p className="mb-3 text-base text-[var(--color-text-muted)]">
        {t('quantityPicker.oneServing', { serving: food.serving })}
      </p>
      <div className="flex flex-wrap gap-2">
        {QUANTITIES.map((quantity) => (
          <button
            key={quantity}
            type="button"
            onClick={() => onConfirm(quantity)}
            className="min-h-11 min-w-11 rounded-lg border-2 border-[var(--color-primary)] bg-white px-4 py-2 text-base font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
          >
            {quantity}
          </button>
        ))}
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 min-w-11 rounded-lg px-4 py-2 text-base text-[var(--color-text-muted)] underline"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  )
}
