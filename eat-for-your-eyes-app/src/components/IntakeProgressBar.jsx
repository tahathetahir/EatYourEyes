import { useI18n } from '../i18n/I18nContext'

// A horizontal progress bar showing today's total as a fraction of the
// AREDS2 trial dose. Shown alongside the numeric percentage everywhere it
// appears -- never the only way the information is conveyed (spec 3.3 /
// accessibility: never colour alone).
export default function IntakeProgressBar({ percent }) {
  const { t } = useI18n()
  // The bar itself is visually capped at 100% (a bar can't extend past its
  // own container) but the number shown next to it is never capped -- see
  // formatPercent in utils/nutrition.js.
  const clampedWidth = Math.min(100, Math.max(0, percent))
  // Intake can genuinely exceed 100% of the trial dose on a good day -- the
  // bar itself is capped at full width, but the ARIA value must never
  // exceed its own stated maximum, so the maximum grows to match.
  const ariaMax = Math.max(100, Math.round(percent))

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={ariaMax}
      aria-label={t('intake.progressAriaLabel')}
      className="h-6 w-full overflow-hidden rounded-full border-2 border-[var(--color-border)] bg-white"
    >
      <div
        className="h-full rounded-full bg-[var(--color-primary)] transition-[width]"
        style={{ width: `${clampedWidth}%` }}
      />
    </div>
  )
}
