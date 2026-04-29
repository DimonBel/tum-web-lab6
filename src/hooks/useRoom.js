import { useState, useEffect } from 'react'
import {
  ref, set, get, update, push, onValue, off, serverTimestamp, remove
} from 'firebase/database'
import { db, isConfigured } from '../lib/firebase'
import { DEFAULT_CHARACTERS } from '../data/characters'

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function pickCharacters(players) {
  const pool = [...DEFAULT_CHARACTERS]
  const result = {}
  Object.keys(players).forEach((pid, i) => {
    result[pid] = pool[i % pool.length]
  })
  return result
}

// ── Create a room in Firebase ──────────────────────────────────
export async function fbCreateRoom(code, hostId, hostName) {
  if (!isConfigured || !db) return
  await set(ref(db, `rooms/${code}`), {
    host: hostId,
    status: 'lobby',
    createdAt: Date.now(),
    players: {
      [hostId]: { name: hostName, score: 0, characterJSON: null, joinedAt: Date.now() }
    },
    questions: null,
  })
}

// ── Join an existing room ──────────────────────────────────────
export async function fbJoinRoom(code, playerId, playerName) {
  if (!isConfigured || !db) return { ok: false, error: 'Firebase not configured — see README.' }
  const snap = await get(ref(db, `rooms/${code}`))
  if (!snap.exists()) return { ok: false, error: 'Room not found.' }
  const room = snap.val()
  if (room.status !== 'lobby') return { ok: false, error: 'Game already in progress.' }
  await set(ref(db, `rooms/${code}/players/${playerId}`), {
    name: playerName, score: 0, characterJSON: null, joinedAt: Date.now(),
  })
  return { ok: true }
}

// ── Host starts game — assign characters ─────────────────────
export async function fbStartGame(code, players) {
  if (!isConfigured || !db) return
  const chars = pickCharacters(players)
  const updates = {}
  Object.entries(chars).forEach(([pid, ch]) => {
    updates[`rooms/${code}/players/${pid}/characterJSON`] = JSON.stringify(ch)
  })
  updates[`rooms/${code}/status`] = 'playing'
  updates[`rooms/${code}/game/currentTurn`] = Object.keys(players)[0]
  updates[`rooms/${code}/game/round`] = 1
  await update(ref(db), updates)
}

// ── Ask a question ────────────────────────────────────────────
export async function fbAskQuestion(code, playerId, playerName, text) {
  if (!isConfigured || !db) return
  await push(ref(db, `rooms/${code}/questions`), {
    by: playerName, byId: playerId, text, answer: null, askedAt: Date.now(),
  })
}

// ── Answer a question ─────────────────────────────────────────
export async function fbAnswerQuestion(code, questionId, answer, nextTurnId) {
  if (!isConfigured || !db) return
  const updates = {
    [`rooms/${code}/questions/${questionId}/answer`]: answer,
  }
  if (answer === 'NO') updates[`rooms/${code}/game/currentTurn`] = nextTurnId
  await update(ref(db), updates)
}

// ── Increment score ───────────────────────────────────────────
export async function fbAddScore(code, playerId) {
  if (!isConfigured || !db) return
  const snap = await get(ref(db, `rooms/${code}/players/${playerId}/score`))
  await set(ref(db, `rooms/${code}/players/${playerId}/score`), (snap.val() || 0) + 1)
}

// ── Mark game finished ────────────────────────────────────────
export async function fbFinishGame(code) {
  if (!isConfigured || !db) return
  await update(ref(db), { [`rooms/${code}/status`]: 'finished' })
}

// ── React hook: listen to a room in real-time ─────────────────
export function useRoomData(code) {
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(!!code)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code || !isConfigured || !db) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    const roomRef = ref(db, `rooms/${code}`)
    onValue(roomRef, snap => {
      setLoading(false)
      if (snap.exists()) setRoom(snap.val())
      else { setRoom(null); setError('Room not found.') }
    }, err => { setLoading(false); setError(err.message) })
    return () => off(roomRef)
  }, [code])

  return { room, loading, error }
}
