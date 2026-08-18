import { useI18n } from '../i18n/I18nContext'

export default function AboutAuthor() {
  const { t } = useI18n()

  return (
    <div className="space-y-6 px-4 py-6">
      <h1 className="text-3xl font-bold text-[var(--color-text)]">{t('about.title')}</h1>

      <section className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-white p-4">
        <span
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl font-bold text-white"
        >
          {t('about.name')
            .split(' ')
            .map((part) => part[0])
            .join('')}
        </span>
        <div>
          <p className="text-xl font-bold text-[var(--color-text)]">{t('about.name')}</p>
          <p className="text-base text-[var(--color-text-muted)]">{t('about.role')}</p>
        </div>
      </section>

      <section aria-labelledby="about-bio-heading" className="space-y-3">
        <h2 id="about-bio-heading" className="text-xl font-bold text-[var(--color-text)]">
          {t('about.bioHeading')}
        </h2>
        <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-white p-4 text-base text-[var(--color-text)]">
          <p>{t('about.bio1')}</p>
          <p>{t('about.bio2')}</p>
          <p>{t('about.bio3')}</p>
        </div>
      </section>

      <section aria-labelledby="about-contact-heading" className="space-y-3">
        <h2 id="about-contact-heading" className="text-xl font-bold text-[var(--color-text)]">
          {t('about.contactHeading')}
        </h2>
        <div className="space-y-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4 text-base text-[var(--color-text)]">
          <p>
            <strong>{t('about.emailLabel')}:</strong> abdullah.0382@beaconite.edu.pk
          </p>
          <p className="text-[var(--color-text-muted)]">{t('about.contactNote')}</p>
        </div>
      </section>
    </div>
  )
}
