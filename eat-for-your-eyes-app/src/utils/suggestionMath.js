// Turns a suggestion's list of food IDs into an actual microgram total, by
// looking each one up in foods.json. This is the only place that does that
// lookup, so suggestions.js never has to store a number that could go stale.

import foodData from '../data/foods.json'
import { percentOfReference } from './nutrition'

const foodsById = new Map(foodData.foods.map((food) => [food.id, food]))

export function getMealFoods(suggestion) {
  return suggestion.foodIds.map((id) => foodsById.get(id)).filter(Boolean)
}

export function getMealTotalUg(suggestion) {
  return getMealFoods(suggestion).reduce((sum, food) => sum + food.ugPerServing, 0)
}

export function getMealPercent(suggestion) {
  return percentOfReference(getMealTotalUg(suggestion))
}
