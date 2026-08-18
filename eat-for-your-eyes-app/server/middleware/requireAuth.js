import { findUserByToken } from '../auth.js'

// Reads "Authorization: Bearer <token>", looks up the session, and attaches
// the user to req.user. Responds 401 rather than throwing if the token is
// missing or invalid.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null
  const user = token ? findUserByToken(token) : null
  if (!user) {
    res.status(401).json({ error: 'Not logged in.' })
    return
  }
  req.user = user
  req.token = token
  next()
}
