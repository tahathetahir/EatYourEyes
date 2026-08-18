// Converts a microgram amount into whichever unit the person has chosen to
// view the app in. foods.json itself always stays in µg -- this is purely a
// display-time conversion, so nothing about the underlying data changes.
export const UNITS = ['µg', 'mg', 'g', 'kg']

const DIVISOR_BY_UNIT = {
  'µg': 1,
  mg: 1e3,
  g: 1e6,
  kg: 1e9,
}

export function convert(ugValue, unit) {
  return ugValue / DIVISOR_BY_UNIT[unit]
}

// mg/g/kg amounts of a nutrient measured in µg are often small fractions
// (e.g. 20,409 µg is 0.000020409 kg). Rounding to a fixed number of decimal
// places would show "0.00" for a lot of real foods, so instead this keeps a
// fixed number of significant figures and expands the decimal places as
// needed -- never switching to scientific notation, which would be harder
// to read at a glance.
function formatSignificant(value, significantDigits = 4) {
  if (value === 0) return '0'
  const magnitude = Math.floor(Math.log10(Math.abs(value)))
  const decimals = Math.max(0, significantDigits - magnitude - 1)
  return value.toFixed(decimals)
}

export function formatUnitValue(ugValue, unit) {
  const value = convert(ugValue, unit)
  if (unit === 'µg') return Math.round(value).toLocaleString()
  return formatSignificant(value)
}
