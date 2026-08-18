import { createContext, useContext, useMemo, useState } from 'react'
import { UNITS, formatUnitValue } from '../utils/units'

const UnitContext = createContext(null)

const UNIT_KEY = 'eatForYourEyes.unit'

function loadStoredUnit() {
  const stored = localStorage.getItem(UNIT_KEY)
  return UNITS.includes(stored) ? stored : 'µg'
}

// One global unit choice affects every µg figure shown anywhere in the app,
// via formatUg() below -- a screen never has its own separate unit setting.
export function UnitProvider({ children }) {
  const [unit, setUnitState] = useState(() => loadStoredUnit())

  function setUnit(nextUnit) {
    setUnitState(nextUnit)
    localStorage.setItem(UNIT_KEY, nextUnit)
  }

  const value = useMemo(
    () => ({
      unit,
      setUnit,
      units: UNITS,
      formatUg: (ugValue) => `${formatUnitValue(ugValue, unit)} ${unit}`,
    }),
    [unit],
  )

  return <UnitContext.Provider value={value}>{children}</UnitContext.Provider>
}

export function useUnit() {
  return useContext(UnitContext)
}
