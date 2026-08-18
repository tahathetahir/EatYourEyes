// Meal suggestions for specification 4. Each suggestion is a name plus a
// list of real food IDs from foods.json -- the microgram total is always
// calculated from the actual database (see getMealTotals in
// utils/suggestions.js), never typed in by hand here. That way the numbers
// shown in the app can never drift from foods.json.
//
// Tags: "vegan" (no animal products at all) or "vegetarian" (may include
// egg/dairy) -- these are the two dietary variants required by specification
// 4.3. A meal can only be one or the other, decided by whether any of its
// foods come from an animal.
//
// The first 12 suggestions reach at least 50% of the trial dose in one
// serving of the meal, using the highest-yield foods in the database
// (specification 4.2 requires at least 10). The last 4 are realistic
// lower-yield options (breakfast, snacks) included honestly, because most of
// the dataset is genuinely low in lutein/zeaxanthin -- see CONTEXT.md "The
// shape of the data."

export const MEAL_SUGGESTIONS = [
  {
    id: 'M01',
    name: 'Buttered canned spinach',
    description: 'Canned spinach, warmed through with a little butter or oil.',
    tags: ['vegan'],
    foodIds: ['F001'],
  },
  {
    id: 'M02',
    name: 'Frozen turnip greens, cooked',
    description: 'A simple cooked side of frozen turnip greens.',
    tags: ['vegan'],
    foodIds: ['F002'],
  },
  {
    id: 'M03',
    name: 'Turnip greens and turnips, mashed',
    description: 'Turnip greens cooked together with turnips, mashed as a side.',
    tags: ['vegan'],
    foodIds: ['F003'],
  },
  {
    id: 'M04',
    name: 'Cooked turnip greens',
    description: 'Chopped turnip greens, cooked and lightly seasoned.',
    tags: ['vegan'],
    foodIds: ['F004'],
  },
  {
    id: 'M05',
    name: 'Salted turnip greens',
    description: 'A half-cup side portion of salted, frozen turnip greens.',
    tags: ['vegan'],
    foodIds: ['F005'],
  },
  {
    id: 'M06',
    name: 'Garden cress salad with a boiled egg',
    description: 'Raw garden cress tossed as a salad, topped with a poached egg.',
    tags: ['vegetarian'],
    foodIds: ['F006', 'F049'],
  },
  {
    id: 'M07',
    name: 'Spinach egg noodles with raw spinach',
    description: 'A bowl of cooked spinach egg noodles with extra raw spinach stirred through.',
    tags: ['vegetarian'],
    foodIds: ['F011', 'F008'],
  },
  {
    id: 'M08',
    name: 'Spring pea and spinach bowl',
    description: 'Raw green peas and raw spinach, dressed simply.',
    tags: ['vegan'],
    foodIds: ['F009', 'F008'],
  },
  {
    id: 'M09',
    name: 'Peas and carrots with sweetcorn',
    description: 'Frozen peas and carrots, cooked, served with canned sweetcorn.',
    tags: ['vegan'],
    foodIds: ['F007', 'F013'],
  },
  {
    id: 'M10',
    name: 'Kale, broccoli and pea stir-fry',
    description: 'Frozen kale and chopped broccoli stir-fried with edible-podded peas.',
    tags: ['vegan'],
    foodIds: ['F010', 'F015', 'F030'],
  },
  {
    id: 'M11',
    name: 'Poke shoot and asparagus medley',
    description: 'Cooked poke shoots with canned and frozen asparagus, and summer squash.',
    tags: ['vegan'],
    foodIds: ['F012', 'F018', 'F025', 'F029'],
  },
  {
    id: 'M12',
    name: 'Braised leeks and zucchini with corn',
    description: 'Cooked leeks and zucchini, with two servings of sweetcorn.',
    tags: ['vegan'],
    foodIds: ['F023', 'F014', 'F024', 'F017'],
  },
  {
    id: 'M13',
    name: 'Brussels sprouts and broccoli side',
    description: 'Raw shredded Brussels sprouts with chopped broccoli.',
    tags: ['vegan'],
    foodIds: ['F021', 'F016'],
  },
  {
    id: 'M14',
    name: 'Egg and beet greens breakfast',
    description: 'A fried or poached egg with a side of raw beet greens.',
    tags: ['vegetarian'],
    foodIds: ['F048', 'F035'],
  },
  {
    id: 'M15',
    name: 'Orange juice and oat flour porridge',
    description: 'A small glass of orange juice with a bowl of oat porridge.',
    tags: ['vegan'],
    foodIds: ['F027', 'F057'],
  },
  {
    id: 'M16',
    name: 'Persimmon and kiwifruit bowl',
    description: 'Sliced Japanese persimmon and green kiwifruit, a fruit snack or dessert.',
    tags: ['vegan'],
    foodIds: ['F020', 'F054'],
  },
]
