import { useI18n } from '../i18n/I18nContext'

// The required disclaimer (CONTEXT.md), shown as its own boxed paragraph so
// it is never mistaken for ordinary body text. Used on the Intake screen,
// the Info screen, and the printable export -- always this same component,
// so the wording can never drift between them.
export default function Disclaimer() {
  const { t } = useI18n()
  return (
    <p className="rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4 text-base leading-relaxed text-[var(--color-text)]">
      <strong>Important: </strong>
      {t('disclaimer.text')}
    </p>
  )
}
