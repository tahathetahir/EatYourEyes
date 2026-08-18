import { useState } from 'react'
import Disclaimer from '../components/Disclaimer'
import { formatTime, localeForLanguage } from '../utils/dateUtils'
import { DATA_SOURCE, DATA_SOURCE_URL, REFERENCE_UG } from '../utils/nutrition'
import { useI18n } from '../i18n/I18nContext'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../api/client'

function FeedbackForm() {
  const { t } = useI18n()
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(null)
  const [status, setStatus] = useState('idle') // idle | submitting | sent | error

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')
    try {
      await apiRequest('/feedback', { method: 'POST', auth: true, body: { message, rating } })
      setMessage('')
      setRating(null)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-[var(--color-border)] bg-white p-4">
      <div>
        <label htmlFor="feedback-message" className="mb-1 block font-semibold text-[var(--color-text)]">
          {t('more.feedbackMessageLabel')}
        </label>
        <textarea
          id="feedback-message"
          required
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="w-full rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
        />
      </div>

      <fieldset>
        <legend className="mb-1 font-semibold text-[var(--color-text)]">{t('more.feedbackRatingLabel')}</legend>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-pressed={rating === value}
              className={`min-h-11 min-w-11 rounded-lg border-2 text-base font-semibold ${
                rating === value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-text)]'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>

      {status === 'sent' && (
        <p role="status" className="text-base font-semibold text-[var(--color-primary)]">
          {t('more.feedbackThanks')}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-base text-[var(--color-text)]">
          {t('common.error')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting' || message.trim().length === 0}
        className="min-h-11 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-base font-semibold text-white disabled:opacity-60"
      >
        {status === 'submitting' ? t('common.loading') : t('more.feedbackSubmit')}
      </button>
    </form>
  )
}

// Combines Reminders (specification 7), the Info screen (specifications 1.5
// and 3.4), Feedback, and Account/logout into one "More" tab, so the bottom
// nav stays a manageable size instead of growing with every new feature --
// these are all settings/reference screens a person visits occasionally,
// not every day.
export default function More({ settings, onUpdateSettings, notificationPermission, onRequestPermission }) {
  const [localTime, setLocalTime] = useState(settings.reminderTime)
  const { t, language } = useI18n()
  const { user, logout } = useAuth()

  const notificationsSupported = typeof window !== 'undefined' && 'Notification' in window

  return (
    <div className="space-y-8 px-4 py-6">
      <section aria-labelledby="reminders-heading" className="space-y-3">
        <h1 id="reminders-heading" className="text-3xl font-bold text-[var(--color-text)]">
          {t('more.remindersHeading')}
        </h1>

        <p className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-3 text-base text-[var(--color-text)]">
          <strong>Please note:</strong> {t('more.remindersNote')}
        </p>

        <fieldset>
          <legend className="sr-only">{t('more.remindMeLabel')}</legend>
          <label className="flex min-h-11 items-center gap-2 text-base font-semibold text-[var(--color-text)]">
            <input
              type="checkbox"
              checked={settings.reminderEnabled}
              onChange={(event) => onUpdateSettings({ ...settings, reminderEnabled: event.target.checked })}
              className="h-6 w-6 shrink-0"
            />
            {t('more.remindMe')}
          </label>
        </fieldset>

        <div>
          <label htmlFor="reminder-time" className="mb-1 block font-semibold text-[var(--color-text)]">
            {t('more.reminderTimeLabel')}
          </label>
          <input
            id="reminder-time"
            type="time"
            value={localTime}
            onChange={(event) => {
              setLocalTime(event.target.value)
              onUpdateSettings({ ...settings, reminderTime: event.target.value })
            }}
            className="min-h-11 rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
          />
          <p className="mt-1 text-base text-[var(--color-text-muted)]">
            {t('more.reminderTimeNote', { time: formatTime(localTime, localeForLanguage(language)) })}
          </p>
        </div>

        {!notificationsSupported && (
          <p className="text-base text-[var(--color-text-muted)]">{t('more.notificationsUnsupported')}</p>
        )}

        {notificationsSupported && notificationPermission !== 'granted' && (
          <button
            type="button"
            onClick={onRequestPermission}
            className="min-h-11 rounded-lg border-2 border-[var(--color-primary)] px-4 py-2 text-base font-semibold text-[var(--color-primary)]"
          >
            {t('more.allowNotifications')}
          </button>
        )}

        {notificationsSupported && notificationPermission === 'granted' && (
          <p className="text-base text-[var(--color-text)]">{t('more.notificationsGranted')}</p>
        )}

        {notificationsSupported && notificationPermission === 'denied' && (
          <p className="text-base text-[var(--color-text-muted)]">{t('more.notificationsDenied')}</p>
        )}
      </section>

      <section aria-labelledby="info-heading" className="space-y-3">
        <h2 id="info-heading" className="text-2xl font-bold text-[var(--color-text)]">
          {t('more.aboutHeading')}
        </h2>

        <div className="space-y-2 rounded-lg border border-[var(--color-border)] bg-white p-4 text-base text-[var(--color-text)]">
          <h3 className="font-bold">{t('more.aboutAredsTitle')}</h3>
          <p>{t('more.aboutAreds1')}</p>
          <p>{t('more.aboutAreds2')}</p>
          <p>{t('more.aboutAreds3', { reference: `${REFERENCE_UG.toLocaleString()} µg` })}</p>
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--color-border)] bg-white p-4 text-base text-[var(--color-text)]">
          <h3 className="font-bold">{t('more.dataSourceTitle')}</h3>
          <p>
            {DATA_SOURCE}.{' '}
            <a
              href={DATA_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--color-primary)] underline"
            >
              {t('more.viewSource')}
            </a>
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-[var(--color-border)] bg-white p-4 text-base text-[var(--color-text)]">
          <h3 className="font-bold">{t('more.limitationsTitle')}</h3>
          <ol className="list-decimal space-y-2 pl-5">
            <li>{t('more.limitation1')}</li>
            <li>
              <strong>{t('more.limitation2Strong')}</strong> {t('more.limitation2Rest')}
            </li>
            <li>{t('more.limitation3')}</li>
            <li>{t('more.limitation4')}</li>
            <li>{t('more.limitation5')}</li>
          </ol>
        </div>

        <Disclaimer />
      </section>

      <section aria-labelledby="feedback-heading" className="space-y-3">
        <h2 id="feedback-heading" className="text-2xl font-bold text-[var(--color-text)]">
          {t('more.feedbackHeading')}
        </h2>
        <p className="text-base text-[var(--color-text-muted)]">{t('more.feedbackDescription')}</p>
        <FeedbackForm />
      </section>

      <section aria-labelledby="account-heading" className="space-y-3">
        <h2 id="account-heading" className="text-2xl font-bold text-[var(--color-text)]">
          {t('more.accountHeading')}
        </h2>
        {user && (
          <p className="text-base text-[var(--color-text)]">
            {t('more.loggedInAs', { username: user.username })}
          </p>
        )}
        <button
          type="button"
          onClick={logout}
          className="min-h-11 rounded-lg border-2 border-[var(--color-primary-dark)] px-4 py-2 text-base font-semibold text-[var(--color-primary-dark)]"
        >
          {t('more.logout')}
        </button>
      </section>
    </div>
  )
}
