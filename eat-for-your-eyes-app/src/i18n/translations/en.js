// English strings. This is the source of truth: every key used anywhere in
// the app must exist here, even if it also exists in other languages -- see
// I18nContext's fallback behaviour.
export default {
  common: {
    loading: 'Loading…',
    cancel: 'Cancel',
    error: 'Something went wrong. Please try again.',
  },

  disclaimer: {
    text: 'This app provides general dietary information and is not medical advice. It does not diagnose or treat any eye condition. The reference figure used is the dose from the AREDS2 clinical trial, not a recommended daily intake. Consult an optometrist or doctor about your eye health.',
  },

  nav: {
    home: 'Home',
    foods: 'Foods',
    suggestions: 'Meals',
    history: 'History',
    more: 'More',
    about: 'About',
  },

  topBar: {
    title: 'Eat For Your Eyes',
    languageLabel: 'Language',
    unitLabel: 'Units',
  },

  auth: {
    tagline: 'Track your lutein and zeaxanthin intake, on your own device.',
    loginTab: 'Log in',
    registerTab: 'Create account',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    languageLabel: 'Language',
    submitLogin: 'Log in',
    submitRegister: 'Create account',
    switchToRegister: "New here? Create an account",
    switchToLogin: 'Already have an account? Log in',
    privacyNote:
      'Your username and password are stored so you can log back in. What you log as eaten stays only on this device and is never sent anywhere.',
  },

  survey: {
    title: 'Just a couple of quick questions',
    description: "This helps us understand who's using the app. Every question is optional.",
    ageRangeLabel: 'What is your age range?',
    ageRangeUnder45: 'Under 45',
    ageRange45to59: '45–59',
    ageRange60to74: '60–74',
    ageRange75plus: '75 or older',
    preferNotToSay: 'Prefer not to say',
    familyAmdLabel: 'Have you or a family member been told you have macular degeneration?',
    yes: 'Yes',
    no: 'No',
    notSure: 'Not sure',
    heardAboutLabel: 'How did you hear about this app?',
    heardAboutPlaceholder: 'e.g. a friend, a clinic, a search engine',
    goalLabel: 'What are you hoping to get from this app?',
    goalTrackIntake: 'Track my lutein/zeaxanthin intake',
    goalLearnFoods: 'Learn which foods are good sources',
    goalBuildHabit: 'Build a daily habit',
    goalOther: 'Other',
    submit: 'Continue',
  },

  home: {
    title: "Today's intake",
    ofTrialDose: '({{percent}} of the AREDS2 trial dose)',
    whatDoesThisMean: 'What does this percentage mean?',
    quickAddHeading: 'Quick add: top foods',
    quickAddDescription: 'These carry the most lutein and zeaxanthin per serving in our database.',
    browseAll: 'Browse all {{count}} foods',
    loggedTodayHeading: 'Logged today',
    nothingLogged: 'Nothing logged yet today. Add a food above to get started.',
    remove: 'Remove',
  },

  foods: {
    title: 'Food database',
    description: '{{count}} foods from {{source}}. Sorted by lutein + zeaxanthin content, highest first.',
    searchLabel: 'Search by name',
    searchPlaceholder: 'e.g. spinach',
    categoryLabel: 'Category',
    allCategories: 'All categories',
    whichToShow: 'Which foods to show',
    showAllLabel: 'Show all foods, including ones with little or no lutein/zeaxanthin',
    showingCountSingular: 'Showing {{count}} food',
    showingCountPlural: 'Showing {{count}} foods',
    noMatches: 'No foods match your search.',
  },

  foodRow: {
    summary: '{{serving}} · {{amount}} · {{percent}} of trial dose',
  },

  quantityPicker: {
    howMany: 'How many servings of {{name}}?',
    oneServing: 'One serving = {{serving}}',
  },

  suggestions: {
    title: 'Meal suggestions',
    description:
      'Built from the highest-yield foods in the database, so a single meal can meaningfully contribute to the trial dose. Each shows what it actually adds up to.',
    filterGroupLabel: 'Filter by diet',
    filterAll: 'All',
    filterVegan: 'Vegan',
    filterVegetarian: 'Vegetarian',
    totalLabel: '{{total}} total · {{percent}} of the AREDS2 trial dose',
    halfDoseBadge: '≥50% in one meal',
    logServing: 'Log 1 serving of {{name}}',
  },

  intake: {
    title: "Today's intake compared to the AREDS2 trial dose",
    progressAriaLabel: "Today's intake as a percentage of the AREDS2 trial dose",
    loggedToday: '{{total}} logged today',
    percentOfDose: 'That is {{percent}} of the {{reference}} used in the AREDS2 clinical trial.',
    note:
      "This is not a recommended daily intake and there is no official RDA for lutein or zeaxanthin. It is simply how today's logged food compares to the dose one specific trial tested.",
    showSource: 'Show where this figure comes from',
    hideSource: 'Hide where this figure comes from',
    whatIsFigure: 'What the 12,000 µg figure is:',
    dataSourceLabel: 'Data source:',
    viewSource: 'View the USDA source document',
  },

  history: {
    title: 'History',
    printExport: 'Print / export',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    chartAriaLabel:
      'Bar chart of daily lutein and zeaxanthin intake for the last 7 days, with a dashed line marking the AREDS2 trial dose',
    chartReferenceLabel: 'AREDS2 trial dose',
    dailyTotalsCaption7: 'Daily intake totals for the last 7 days',
    dailyTotalsCaption30: 'Daily intake totals for the last 30 days',
    day: 'Day',
    total: 'Total',
    percentOfDose: '% of trial dose',
    summaryTitle: 'Eat For Your Eyes — intake summary',
    generated: 'Generated {{date}}',
  },

  more: {
    remindersHeading: 'Daily reminder',
    remindersNote:
      'Please note: this reminder only works while this app is open in your browser on this device. It does not work reliably once the browser is closed, and is not supported at all on some mobile browsers (notably iPhone home-screen shortcuts). It is a helpful nudge, not a dependable alarm.',
    remindMeLabel: 'Turn daily reminder on or off',
    remindMe: 'Remind me to log food each day',
    reminderTimeLabel: 'Reminder time',
    reminderTimeNote:
      'Set for {{time}}. The reminder is skipped on any day you have already reached the trial dose.',
    notificationsUnsupported:
      'This browser does not support notifications, so the reminder can only appear as an on-screen message while you are using the app.',
    allowNotifications: 'Allow browser notifications',
    notificationsGranted: 'Browser notifications are allowed.',
    notificationsDenied:
      'Notifications were blocked for this site. You can still see the reminder while the app is open, but no system notification will appear.',

    aboutHeading: 'About this app',
    aboutAredsTitle: 'What AREDS2 actually tested',
    aboutAreds1:
      'The AREDS2 trial (US National Eye Institute, published in JAMA 2013, with a 10-year follow-up in 2022) enrolled 4,203 people aged 50–85 who already had intermediate age-related macular degeneration (AMD), or advanced AMD in one eye. It tested adding 10 mg lutein + 2 mg zeaxanthin daily to an existing antioxidant formula.',
    aboutAreds2:
      'The main comparison found no statistically significant benefit from adding lutein and zeaxanthin to the original formula. Benefits appeared in secondary analyses, and in a direct comparison against beta-carotene. People with the lowest dietary intake at the start of the trial showed the clearest benefit — around 25% lower likelihood of developing advanced AMD. Beta-carotene was later removed from the recommended formula because 10-year data showed it nearly doubled lung cancer risk in people who had smoked.',
    aboutAreds3:
      'There is no official recommended daily allowance (RDA) for lutein or zeaxanthin. The {{reference}} figure used throughout this app is the dose from this one clinical trial, nothing more.',
    dataSourceTitle: 'Data source',
    viewSource: 'View the source document',
    limitationsTitle: 'Known limitations of this data',
    limitation1: 'Values are lutein and zeaxanthin combined — the USDA source does not separate the two.',
    limitation2Strong: 'Kale is inconsistent between data sources.',
    limitation2Rest:
      'The USDA table used here (SR Legacy) lists raw kale at 1,315 µg per cup, but other published sources list over 20,000 µg per cup for kale. This app shows the USDA SR Legacy figure and discloses this discrepancy rather than picking whichever number looks better.',
    limitation3:
      'Lutein is fat-soluble — absorption increases when it is eaten together with some fat. A raw microgram total can overstate how much is actually absorbed.',
    limitation4: 'Cooking method changes the values considerably (raw vs. frozen vs. canned vs. cooked).',
    limitation5: 'The dataset is US-based (USDA) and may not include foods common in other cuisines.',

    feedbackHeading: 'Feedback',
    feedbackDescription: "Tell us what's working, what's confusing, or what you'd like to see next.",
    feedbackMessageLabel: 'Your feedback',
    feedbackRatingLabel: 'How would you rate the app so far?',
    feedbackSubmit: 'Send feedback',
    feedbackThanks: 'Thanks — your feedback has been recorded.',

    accountHeading: 'Account',
    loggedInAs: 'Logged in as {{username}}',
    logout: 'Log out',
  },

  about: {
    title: 'About the author',
    name: 'Abdullah Akber',
    role: 'Creator of Eat For Your Eyes',
    bioHeading: 'Why I built this',
    bio1:
      "This app grew out of my IB MYP Personal Project. A neuroscience and biomechanics summer course first pulled me toward the brain and the senses, and a later engineering summer school introduced me to age-related macular degeneration (AMD) — a leading cause of vision loss that has no cure, only ways to slow it down.",
    bio2:
      "Talking with my grandmother about her own eyesight made the issue feel personal rather than academic. Learning that a large share of families in Pakistan have limited access to information or care about conditions like this convinced me it was worth building something openly available, rather than another paper report.",
    bio3:
      "Independent research pointed to lutein and zeaxanthin — nutrients studied in the AREDS2 clinical trial — as a diet-based angle worth surfacing clearly and honestly, without overstating what the evidence actually shows. This app is the result: a food database, an intake tracker, and meal ideas, built with an AI coding assistant and a strong emphasis on plain, careful language.",
    contactHeading: 'Get in touch',
    emailLabel: 'Email',
    emailPlaceholder: '(add your email here)',
    contactNote: 'Feedback, questions, and corrections are welcome — see the Feedback section under More.',
  },
}
