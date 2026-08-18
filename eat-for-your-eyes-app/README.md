# Eat For Your Eyes

A food-and-nutrition tracker built around one nutrient pair: **lutein and
zeaxanthin**, the two carotenoids studied in the AREDS2 clinical trial for
age-related macular degeneration (AMD). It is a food database, a daily
intake tracker, meal suggestions, and a 30-day history — built as an IB
MYP Personal Project.

This README explains what the app does, how it is put together, how to
run it, and what its honest limitations are.

## Why this app exists, and the language it's careful about

AMD is a leading cause of vision loss with no cure — only ways to slow its
progression. Diet is one of those ways: the AREDS2 trial tested 10 mg
lutein + 2 mg zeaxanthin (12,000 µg combined) daily against a placebo, in
people who already had AMD. The trial found a modest benefit, strongest in
people whose diet was already low in these nutrients — see the "About this
app" section inside the app (More → About this app) for the full,
unvarnished summary, including what the trial did *not* show.

Because of that, the app is careful never to say a food or a percentage
"prevents" or "treats" AMD, and never to call the 12,000 µg reference a
"recommended daily intake" — there is no official RDA for lutein or
zeaxanthin. Every screen that shows the percentage also shows the
disclaimer making that distinction explicit. See `CONTEXT.md` (one
directory above this app) for the full language rules this project follows.

## Architecture

```
eat-for-your-eyes-app/
  src/            React + Vite + Tailwind frontend
  server/         Node/Express backend (accounts, login history, survey, feedback)
```

**The most important architectural fact about this app: the backend never
sees what anyone eats.**

The original version of this app (see `CONTEXT.md`'s "Technical
decisions") was deliberately built with *no accounts and no server* — all
data stayed in the browser's `localStorage`, as a privacy feature. When
accounts, a login history, a short survey, and a feedback form were added,
that promise was kept by **splitting the data**:

| Data | Where it lives | Ever sent to the server? |
|---|---|---|
| Username, password (hashed), language | `server/data/app.db` (SQLite) | Yes — that's what accounts are |
| A timestamp each time you log in | `server/data/app.db` | Yes |
| Your survey answers | `server/data/app.db` | Yes |
| Feedback messages | `server/data/app.db` | Yes |
| **What you logged as eaten, and when** | **Browser `localStorage` only** (`src/utils/storage.js`) | **No, never** |
| Reminder time / notification settings | Browser `localStorage` only | No |

The food log is still scoped per logged-in username (so two accounts on
the same browser don't see each other's logs), but that scoping happens
entirely on the device — the server has no endpoint that could receive a
food log even if the frontend tried to send one.

### Frontend (`src/`)

- **React 19 + Vite + Tailwind CSS 4** — unchanged from the original stack.
- `context/AuthContext.jsx` — who's logged in; talks to the backend via `api/client.js`.
- `context/UnitContext.jsx` — the globally selected display unit (µg/mg/g/kg).
- `i18n/I18nContext.jsx` + `i18n/translations/{en,ur}.js` — a small hand-rolled
  translation layer (no library — just key lookup + `{{variable}}`
  interpolation), plus setting `dir="rtl"` on `<html>` for Urdu.
- `utils/storage.js` — the **only** file that reads/writes the food log and
  reminder settings, all in `localStorage`.
- `utils/units.js` — µg → mg/g/kg conversion and formatting.
- `screens/` — one component per screen: `Login`, `Survey`, `Home`, `Foods`,
  `Suggestions`, `Intake`, `History`, `AboutAuthor`, `More`.

### Backend (`server/`)

A small Express server whose only job is accounts, login history, survey
answers, and feedback.

- `server/db.js` — SQLite via Node's **built-in** `node:sqlite` module (no
  native compilation step, no extra dependency).
- `server/auth.js` — password hashing (`crypto.scryptSync`, salted) and
  opaque session tokens (`crypto.randomUUID()`), both from Node's built-in
  `crypto` module. No `bcrypt` or `jsonwebtoken` dependency needed.
- `server/routes/auth.js` — `POST /register`, `POST /login` (also records a
  `login_history` row), `POST /logout`, `GET /me`, `PUT /language`.
- `server/routes/survey.js` — `POST /` — one survey response per user (its
  presence is what decides whether the survey screen shows again).
- `server/routes/feedback.js` — `POST /` — auth optional, so it still works
  even if the "must have an account" rule is ever loosened.

The backend's only two dependencies are `express` and `cors`.

## Running it locally

Two processes, in two terminals:

```bash
# Terminal 1 — backend (accounts/survey/feedback API)
cd server
npm install
npm run dev          # http://localhost:3001, auto-restarts on file changes

# Terminal 2 — frontend
npm install
npm run dev           # http://localhost:5173 (or next free port)
```

In development, Vite proxies `/api/*` requests to `http://localhost:3001`
(see `vite.config.js`), so the frontend never needs to know the backend's
exact address — that only matters for a packaged/production build (see
below).

The backend creates `server/data/app.db` automatically on first run. It is
git-ignored (`server/data/*.db*`) — nobody's account data should ever be
committed.

## Feature walkthrough

### The original eight specifications
1. **Food database** — 145 USDA-sourced entries (`src/data/foods.json`),
   searchable and filterable by category, with known data limitations
   disclosed in More → About this app.
2. **Daily intake calculator** — adding/removing logged foods recalculates
   the running total live; 30 days of history are kept.
3. **Daily intake score** — today's total shown as a percentage of the
   AREDS2 trial dose, always labelled as a trial dose, never an RDA.
4. **Meal suggestions** — 16 suggestions built directly from real food IDs
   (`src/data/suggestions.js`); totals are computed live from the food
   database, never hand-typed, so they can't drift out of sync.
5. **Progress tracking & export** — a 7-day bar chart plus a 30-day table;
   "Print / export" uses the browser's print dialog with a dedicated print
   stylesheet, rather than a PDF library.
6. **Interface & accessibility** — see the checklist below.
7. **Reminders** — an optional daily on-screen (and, if permitted, browser
   push) reminder, skipped automatically once the trial dose is met for
   the day.
8. **User testing** — outside the scope of this codebase.

### What was added on top
- **Accounts** (Login screen: username, password, language) — real
  accounts backed by the SQLite database described above.
- **A short post-login survey** — four optional questions (age range,
  family AMD history, how you heard about the app, your goal), shown once
  after first login; every question can be answered "prefer not to say."
- **Language switcher** — English and Urdu, selectable at registration and
  any time afterward from the top bar. All UI chrome (labels, headings,
  disclaimers, the survey, the About page) is translated; **food names in
  the database are English-only** — translating all 145 USDA entries was
  out of scope. Urdu also switches the page to right-to-left layout.
- **Unit switcher** — every µg figure anywhere in the app can be viewed as
  µg, mg, g, or kg from the top bar; the choice is global, not per-screen.
- **Feedback form** (More → Feedback) — a message plus an optional 1–5
  rating, sent to the backend.
- **About Author tab** — background on why the app was built.

## Accessibility (unchanged from the original spec, still enforced)
- Body text starts at 18px, never below 16px.
- Every text/background colour pairing is ≥4.5:1 contrast.
- Every tap target is at least 44×44px.
- Every core task is reachable within 3 taps of Home.
- No horizontal scrolling from 320px width up.
- Tier and progress information is never colour-only (always paired with
  text and/or a symbol).
- Real semantic HTML (`<button>`, `<label>`, `<main>`, `<nav>`) throughout;
  visible keyboard focus outlines everywhere.

## Known limitations

- **Server error messages are English-only**, even when the UI language is
  Urdu (e.g. "That username is already taken.") — translating backend
  validation messages was out of scope for this pass.
- **Urdu layout is right-to-left but not pixel-mirrored** — text direction
  flips, but icons/charts were not individually re-mirrored.
- **Food names, categories, and servings stay in English** in both
  languages — only UI chrome is translated.
- Two lint warnings (`react/only-export-components`, oxlint) are expected
  in the three context files that export both a Provider component and a
  hook (`AuthContext.jsx`, `UnitContext.jsx`, `I18nContext.jsx`) — a very
  common React pattern that this specific fast-refresh-focused lint rule
  flags but does not error on.
- See More → About this app inside the running app for the data-source
  limitations (lutein/zeaxanthin combined values, the kale discrepancy
  between sources, fat-solubility, cooking-method effects, US-only
  dataset).

## Packaging for the Play Store (architecture, not yet executed)

The frontend was deliberately kept decoupled from a hardcoded backend
address specifically so it can be wrapped for a native build later:

1. **Deploy `server/` somewhere reachable from the internet** — a packaged
   mobile app cannot reach `localhost` on a developer's machine. Any small
   Node host works (a VPS, Render, Railway, etc.).
2. Set `VITE_API_BASE_URL` to that deployed URL when building the frontend
   (`VITE_API_BASE_URL=https://your-backend.example.com/api npm run build`)
   — this is the one thing that has to change between a dev build and a
   packaged build; nothing else in the frontend needs to know.
3. `npx cap init`, `npx cap add android`, then `npx cap open android` to
   open the wrapped app in Android Studio and build a release APK/AAB —
   [Capacitor](https://capacitorjs.com/) wraps the existing Vite build
   rather than requiring a rewrite.
4. **New obligation this creates**: once the app has real accounts, the
   Play Store requires a published privacy policy URL describing what the
   `server/` backend stores (see the data table above) before the listing
   can go live.

## Data source

USDA National Nutrient Database for Standard Reference, Legacy (2018),
lutein + zeaxanthin combined, micrograms per household serving. See More →
About this app inside the running app for the direct source link and the
full list of known caveats in this dataset.
