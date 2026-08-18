import { useMemo } from 'react'
import Disclaimer from '../components/Disclaimer'
import { lastNDateKeys, formatShortDate, localeForLanguage } from '../utils/dateUtils'
import { loadHistory } from '../utils/storage'
import { REFERENCE_UG, formatPercent } from '../utils/nutrition'
import { useUnit } from '../context/UnitContext'
import { useI18n } from '../i18n/I18nContext'

const CHART_WIDTH = 320
const CHART_HEIGHT = 180
const CHART_PADDING = { top: 16, bottom: 28, left: 8, right: 8 }

// A small, hand-rolled SVG bar chart -- CONTEXT.md's technical decisions
// rule out adding a heavy charting library for something this simple. The
// chart is paired with a plain HTML table showing the same numbers, so the
// data is available as real text too, not only as bar heights.
function SevenDayChart({ days, t }) {
  const maxValue = Math.max(REFERENCE_UG, ...days.map((d) => d.total)) * 1.1
  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom
  const barWidth = plotWidth / days.length - 8
  const referenceY = CHART_PADDING.top + plotHeight - (REFERENCE_UG / maxValue) * plotHeight

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      role="img"
      aria-label={t('history.chartAriaLabel')}
      className="w-full"
    >
      {/* Reference line at the trial dose, dashed so it reads as a target rather than a data bar */}
      <line
        x1={CHART_PADDING.left}
        x2={CHART_WIDTH - CHART_PADDING.right}
        y1={referenceY}
        y2={referenceY}
        stroke="#0b4f8a"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <text x={CHART_PADDING.left} y={referenceY - 6} fontSize="10" fill="#0b4f8a">
        {t('history.chartReferenceLabel')}
      </text>

      {days.map((day, index) => {
        const barHeight = (day.total / maxValue) * plotHeight
        const x = CHART_PADDING.left + index * (plotWidth / days.length) + 4
        const y = CHART_PADDING.top + plotHeight - barHeight
        return (
          <g key={day.key}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barHeight, 1)}
              fill={day.total >= REFERENCE_UG ? '#0b6e4f' : '#0e5a6b'}
              rx="3"
            />
            <text
              x={x + barWidth / 2}
              y={CHART_HEIGHT - 8}
              fontSize="10"
              textAnchor="middle"
              fill="#1b2b34"
            >
              {day.shortLabel}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function History() {
  const { formatUg } = useUnit()
  const { t, language } = useI18n()
  const locale = localeForLanguage(language)

  // Recomputed on every render rather than cached in React state -- the log
  // only changes when the user adds or removes a food, which happens on
  // other screens, so re-reading localStorage here always shows the latest
  // totals without needing shared app-wide state for it.
  const history = useMemo(() => loadHistory(30), [])

  const last7 = useMemo(() => {
    return lastNDateKeys(7).map((key) => ({
      key,
      total: history[key] ?? 0,
      shortLabel: formatShortDate(key, locale).slice(0, 3),
      fullLabel: formatShortDate(key, locale),
    }))
  }, [history, locale])

  const last30 = useMemo(() => {
    return lastNDateKeys(30)
      .slice()
      .reverse()
      .map((key) => ({ key, total: history[key] ?? 0, label: formatShortDate(key, locale) }))
  }, [history, locale])

  const generatedAt = new Date().toLocaleString(locale)

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">{t('history.title')}</h1>
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-lg border-2 border-[var(--color-primary)] px-4 py-2 text-base font-semibold text-[var(--color-primary)]"
        >
          {t('history.printExport')}
        </button>
      </div>

      <section className="space-y-3 print:hidden">
        <h2 className="text-xl font-bold text-[var(--color-text)]">{t('history.last7Days')}</h2>
        <div className="rounded-lg border border-[var(--color-border)] bg-white p-3">
          <SevenDayChart days={last7} t={t} />
        </div>
        <table className="w-full border-collapse text-base">
          <caption className="sr-only">{t('history.dailyTotalsCaption7')}</caption>
          <thead>
            <tr className="border-b-2 border-[var(--color-border)] text-left">
              <th scope="col" className="py-2">
                {t('history.day')}
              </th>
              <th scope="col" className="py-2">
                {t('history.total')}
              </th>
              <th scope="col" className="py-2">
                {t('history.percentOfDose')}
              </th>
            </tr>
          </thead>
          <tbody>
            {last7.map((day) => (
              <tr key={day.key} className="border-b border-[var(--color-border)]">
                <td className="py-2">{day.fullLabel}</td>
                <td className="py-2">{formatUg(day.total)}</td>
                <td className="py-2">{formatPercent(day.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-2 print:hidden">
        <h2 className="text-xl font-bold text-[var(--color-text)]">{t('history.last30Days')}</h2>
        <table className="w-full border-collapse text-base">
          <caption className="sr-only">{t('history.dailyTotalsCaption30')}</caption>
          <thead>
            <tr className="border-b-2 border-[var(--color-border)] text-left">
              <th scope="col" className="py-2">
                {t('history.day')}
              </th>
              <th scope="col" className="py-2">
                {t('history.total')}
              </th>
            </tr>
          </thead>
          <tbody>
            {last30.map((day) => (
              <tr key={day.key} className="border-b border-[var(--color-border)]">
                <td className="py-2">{day.label}</td>
                <td className="py-2">{formatUg(day.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="print:hidden">
        <Disclaimer />
      </div>

      {/* Printable summary. Hidden on screen, shown only when printing, so a
          printed page is a clean one-page report rather than the whole
          interactive screen with buttons and toggles on it. */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-bold">{t('history.summaryTitle')}</h1>
        <p>{t('history.generated', { date: generatedAt })}</p>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-1 text-left">{t('history.day')}</th>
              <th className="border p-1 text-left">{t('history.total')}</th>
              <th className="border p-1 text-left">{t('history.percentOfDose')}</th>
            </tr>
          </thead>
          <tbody>
            {last7.map((day) => (
              <tr key={day.key}>
                <td className="border p-1">{day.fullLabel}</td>
                <td className="border p-1">{formatUg(day.total)}</td>
                <td className="border p-1">{formatPercent(day.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <Disclaimer />
        </div>
      </div>
    </div>
  )
}
