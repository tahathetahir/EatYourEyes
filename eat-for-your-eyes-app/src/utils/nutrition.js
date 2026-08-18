// Shared constants and maths for comparing intake against the AREDS2 trial
// dose. Kept in one place so the number 12000 and its label never have to be
// retyped (and risk drifting from the language rules in CONTEXT.md).

import foodData from '../data/foods.json'

export const REFERENCE_UG = foodData.meta.referenceUg // 12000
export const REFERENCE_LABEL = foodData.meta.referenceLabel
export const REFERENCE_CAVEAT = foodData.meta.referenceCaveat
export const DATA_SOURCE = foodData.meta.source
export const DATA_SOURCE_URL = foodData.meta.sourceUrl

// The exact disclaimer text required by CONTEXT.md now lives in the i18n
// dictionaries (disclaimer.text in src/i18n/translations/*.js) so it can be
// shown in whichever language is selected, while still being one single
// piece of text every screen pulls from -- see components/Disclaimer.jsx.

// Percentage of the trial dose a given microgram total represents. Not
// capped at 100 -- if someone eats well over the dose, the honest number is
// shown rather than silently clamped.
export function percentOfReference(ug) {
  return (ug / REFERENCE_UG) * 100
}

// Rounds a percentage for display: whole numbers under 100%, one decimal
// place isn't needed for a figure this approximate.
export function formatPercent(ug) {
  return Math.round(percentOfReference(ug)) + '%'
}
