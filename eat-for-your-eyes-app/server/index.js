// The Eat For Your Eyes backend. This server exists only for accounts,
// login history, survey answers, and feedback -- it never receives what a
// user has eaten. The daily food/nutrient log stays entirely on-device in
// the frontend's localStorage (see src/utils/storage.js). That split is a
// deliberate decision, not an oversight: see /README.md.
import express from 'express'
import cors from 'cors'
import { authRouter } from './routes/auth.js'
import { surveyRouter } from './routes/survey.js'
import { feedbackRouter } from './routes/feedback.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/survey', surveyRouter)
app.use('/api/feedback', feedbackRouter)

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Eat For Your Eyes backend listening on http://localhost:${PORT}`)
})
