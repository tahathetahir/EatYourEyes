import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

export const surveyRouter = Router()

surveyRouter.post('/', requireAuth, (req, res) => {
  const { answers } = req.body ?? {}
  if (typeof answers !== 'object' || answers === null) {
    res.status(400).json({ error: 'Survey answers are required.' })
    return
  }

  db.prepare('INSERT INTO survey_responses (user_id, answers_json, created_at) VALUES (?, ?, ?)').run(
    req.user.id,
    JSON.stringify(answers),
    new Date().toISOString(),
  )

  res.status(201).json({ ok: true })
})
