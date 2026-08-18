import { Router } from 'express'
import { db } from '../db.js'
import { findUserByToken } from '../auth.js'

export const feedbackRouter = Router()

// Auth is optional here (unlike survey/logout): feedback should still be
// collectible even if we ever loosen the "must be logged in to use the app"
// rule later, so user_id is nullable in the table.
feedbackRouter.post('/', (req, res) => {
  const { message, rating } = req.body ?? {}
  if (typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'Feedback message is required.' })
    return
  }

  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
  const user = token ? findUserByToken(token) : null

  const safeRating = Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null

  db.prepare('INSERT INTO feedback (user_id, message, rating, created_at) VALUES (?, ?, ?, ?)').run(
    user?.id ?? null,
    message.trim(),
    safeRating,
    new Date().toISOString(),
  )

  res.status(201).json({ ok: true })
})
