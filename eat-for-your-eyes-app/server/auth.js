// Password hashing and session tokens, both using only Node's built-in
// crypto module -- no bcrypt/jsonwebtoken dependency needed for a project
// this size.
import crypto from 'node:crypto'
import { db } from './db.js'

const SCRYPT_KEYLEN = 64

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex')
  return { hash, salt }
}

export function verifyPassword(password, hash, salt) {
  const candidate = crypto.scryptSync(password, salt, SCRYPT_KEYLEN)
  const stored = Buffer.from(hash, 'hex')
  return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored)
}

export function createSession(userId) {
  const token = crypto.randomUUID()
  db.prepare('INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)').run(
    token,
    userId,
    new Date().toISOString(),
  )
  return token
}

export function findUserByToken(token) {
  const session = db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(token)
  if (!session) return null
  return db.prepare('SELECT id, username, language FROM users WHERE id = ?').get(session.user_id)
}

export function destroySession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
}
