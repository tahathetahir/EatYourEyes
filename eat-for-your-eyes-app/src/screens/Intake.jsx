import { useState } from 'react'
import Disclaimer from '../components/Disclaimer'
import IntakeProgressBar from '../components/IntakeProgressBar'
import {
  REFERENCE_UG,
  REFERENCE_LABEL,
  REFERENCE_CAVEAT,
  DATA_SOURCE,
  DATA_SOURCE_URL,
  formatPercent,
  percentOfReference,
} from '../utils/nutrition'
import { useUnit } from '../context/UnitContext'
import { useI18n } from '../i18n/I18nContext'

// The intake comparison screen (specification 3 / Stage 3). Every sentence
// on this screen was drafted against the "Language rules" table in
// CONTEXT.md: it never says "recommended," "deficient," or implies a
// diagnosis -- only a description of intake compared to the dose used in
// one specific clinical trial.
export default function Intake({ todayTotal }) {
  const [sourceOpen, setSourceOpen] = useState(false)
  const percent = percentOfReference(todayTotal)
  const { formatUg } = useUnit()
  const { t } = useI18n()

  return (
    <div className="space-y-6 px-4 py-6">
      <h1 className="text-3xl font-bold text-[var(--color-text)]">{t('intake.title')}</h1>

      <section className="space-y-3 rounded-lg border border-[var(--color-border)] bg-white p-4">
        <p className="text-2xl font-semibold text-[var(--color-text)]">
          {t('intake.loggedToday', { total: formatUg(todayTotal) })}
        </p>
        <p className="text-xl text-[var(--color-text)]">
          {t('intake.percentOfDose', { percent: formatPercent(todayTotal), reference: formatUg(REFERENCE_UG) })}
        </p>
        <IntakeProgressBar percent={percent} />
        <p className="text-base text-[var(--color-text-muted)]">{t('intake.note')}</p>
      </section>

      <Disclaimer />

      <section className="space-y-2">
        <button
          type="button"
          onClick={() => setSourceOpen((open) => !open)}
          aria-expanded={sourceOpen}
          className="min-h-11 text-base font-semibold text-[var(--color-primary)] underline"
        >
          {sourceOpen ? t('intake.hideSource') : t('intake.showSource')}
        </button>
        {sourceOpen && (
          <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4 text-base text-[var(--color-text)]">
            <p>
              <strong>{t('intake.whatIsFigure')}</strong> {REFERENCE_LABEL}.
            </p>
            <p>{REFERENCE_CAVEAT}</p>
            <p>
              <strong>{t('intake.dataSourceLabel')}</strong> {DATA_SOURCE}.{' '}
              <a
                href={DATA_SOURCE_URL}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[var(--color-primary)] underline"
              >
                {t('intake.viewSource')}
              </a>
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
