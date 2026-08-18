import { useState } from 'react'
import { apiRequest } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n/I18nContext'

const PREFER_NOT_TO_SAY = 'prefer_not_to_say'

function RadioGroup({ legend, name, options, value, onChange }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 font-semibold text-[var(--color-text)]">{legend}</legend>
      <div className="space-y-1">
        {options.map((option) => (
          <label key={option.value} className="flex min-h-11 items-center gap-2 text-base text-[var(--color-text)]">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-5 w-5 shrink-0"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// Shown once, right after a person's first login, before the rest of the
// app is reachable (per the user's request). Every question can be
// answered "prefer not to say" -- nothing here blocks someone from
// finishing and moving on.
export default function Survey({ onComplete }) {
  const { markSurveyComplete } = useAuth()
  const { t } = useI18n()
  const [ageRange, setAgeRange] = useState(PREFER_NOT_TO_SAY)
  const [familyAmd, setFamilyAmd] = useState(PREFER_NOT_TO_SAY)
  const [heardAbout, setHeardAbout] = useState('')
  const [goal, setGoal] = useState(PREFER_NOT_TO_SAY)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const ageOptions = [
    { value: 'under_45', label: t('survey.ageRangeUnder45') },
    { value: '45_59', label: t('survey.ageRange45to59') },
    { value: '60_74', label: t('survey.ageRange60to74') },
    { value: '75_plus', label: t('survey.ageRange75plus') },
    { value: PREFER_NOT_TO_SAY, label: t('survey.preferNotToSay') },
  ]
  const yesNoOptions = [
    { value: 'yes', label: t('survey.yes') },
    { value: 'no', label: t('survey.no') },
    { value: 'not_sure', label: t('survey.notSure') },
    { value: PREFER_NOT_TO_SAY, label: t('survey.preferNotToSay') },
  ]
  const goalOptions = [
    { value: 'track_intake', label: t('survey.goalTrackIntake') },
    { value: 'learn_foods', label: t('survey.goalLearnFoods') },
    { value: 'build_habit', label: t('survey.goalBuildHabit') },
    { value: 'other', label: t('survey.goalOther') },
    { value: PREFER_NOT_TO_SAY, label: t('survey.preferNotToSay') },
  ]

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await apiRequest('/survey', {
        method: 'POST',
        auth: true,
        body: { answers: { ageRange, familyAmd, heardAbout: heardAbout.trim(), goal } },
      })
      markSurveyComplete()
      onComplete?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">{t('survey.title')}</h1>
        <p className="text-base text-[var(--color-text-muted)]">{t('survey.description')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-[var(--color-border)] bg-white p-4">
        <RadioGroup
          legend={t('survey.ageRangeLabel')}
          name="ageRange"
          options={ageOptions}
          value={ageRange}
          onChange={setAgeRange}
        />

        <RadioGroup
          legend={t('survey.familyAmdLabel')}
          name="familyAmd"
          options={yesNoOptions}
          value={familyAmd}
          onChange={setFamilyAmd}
        />

        <div>
          <label htmlFor="survey-heard-about" className="mb-1 block font-semibold text-[var(--color-text)]">
            {t('survey.heardAboutLabel')}
          </label>
          <input
            id="survey-heard-about"
            type="text"
            value={heardAbout}
            onChange={(event) => setHeardAbout(event.target.value)}
            placeholder={t('survey.heardAboutPlaceholder')}
            className="min-h-11 w-full rounded-lg border-2 border-[var(--color-border)] px-3 py-2 text-base"
          />
        </div>

        <RadioGroup
          legend={t('survey.goalLabel')}
          name="goal"
          options={goalOptions}
          value={goal}
          onChange={setGoal}
        />

        {error && (
          <p role="alert" className="rounded-lg bg-[var(--color-bg-alt)] p-3 text-base text-[var(--color-text)]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 w-full rounded-lg bg-[var(--color-primary)] px-4 py-2 text-base font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? t('common.loading') : t('survey.submit')}
        </button>
      </form>
    </div>
  )
}
