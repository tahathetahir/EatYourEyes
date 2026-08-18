import { Router } from 'express'
import { db } from '../db.js'
import { hashPassword, verifyPassword, createSession, destroySession } from '../auth.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const authRouter = Router()

const SUPPORTED_LANGUAGES = ['en', 'ur']

function hasSurveyResponse(userId) {
  const row = db.prepare('SELECT id FROM survey_responses WHERE user_id = ? LIMIT 1').get(userId)
  return Boolean(row)
}

function publicUser(user) {
  return { id: user.id, username: user.username, language: user.language }
}

authRouter.post('/register', (req, res) => {
  const { username, password, language } = req.body ?? {}

  if (typeof username !== 'string' || username.trim().length < 3) {
    res.status(400).json({ error: 'Username must be at least 3 characters.' })
    return
  }
  if (typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters.' })
    return
  }
  const safeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en'

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim())
  if (existing) {
    res.status(409).json({ error: 'That username is already taken.' })
    return
  }

  const { hash, salt } = hashPassword(password)
  const { lastInsertRowid } = db
    .prepare(
      'INSERT INTO users (username, password_hash, salt, language, created_at) VALUES (?, ?, ?, ?, ?)',
    )
    .run(username.trim(), hash, salt, safeLanguage, new Date().toISOString())

  const user = db.prepare('SELECT id, username, language FROM users WHERE id = ?').get(lastInsertRowid)
  const token = createSession(user.id)
  db.prepare('INSERT INTO login_history (user_id, logged_in_at) VALUES (?, ?)').run(
    user.id,
    new Date().toISOString(),
  )

  res.status(201).json({ token, user: publicUser(user), hasSurvey: false })
})

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body ?? {}
  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Username and password are required.' })
    return
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim())
  if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
    res.status(401).json({ error: 'Incorrect username or password.' })
    return
  }

  const token = createSession(user.id)
  db.prepare('INSERT INTO login_history (user_id, logged_in_at) VALUES (?, ?)').run(
    user.id,
    new Date().toISOString(),
  )

  res.json({ token, user: publicUser(user), hasSurvey: hasSurveyResponse(user.id) })
})

authRouter.post('/logout', requireAuth, (req, res) => {
  destroySession(req.token)
  res.status(204).end()
})

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user), hasSurvey: hasSurveyResponse(req.user.id) })
})

authRouter.put('/language', requireAuth, (req, res) => {
  const { language } = req.body ?? {}
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    res.status(400).json({ error: 'Unsupported language.' })
    return
  }
  db.prepare('UPDATE users SET language = ? WHERE id = ?').run(language, req.user.id)
  res.json({ user: { ...publicUser(req.user), language } })
})
