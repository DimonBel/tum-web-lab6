import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePlayerId } from '../hooks/usePlayerId'
import { useRoomData, generateRoomCode, fbCreateRoom, fbJoinRoom, fbStartGame, fbAskQuestion, fbAnswerQuestion, fbAddScore, fbFinishGame } from '../hooks/useRoom'
import { DEFAULT_CHARACTERS, DEFAULT_PLAYERS } from '../data/characters'
import { isConfigured } from '../lib/firebase'

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const myId = usePlayerId()
  const [myName, setMyNameStore] = useLocalStorage('wai-player-name', null)
  const [characters, setCharacters] = useLocalStorage('wai-characters', DEFAULT_CHARACTERS)

  const [screen, setScreen] = useState('home')
  const [navHistory, setNavHistory] = useState(['home'])
  const [roomCode, setRoomCode] = useState(() => {
    // Read ?room=XYZ from URL on first load so scan-to-join works
    const params = new URLSearchParams(window.location.search)
    return params.get('room') || null
  })
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState(null)

  // Local demo state (used when Firebase not configured)
  const [demoCharacter] = useState(
    DEFAULT_CHARACTERS[Math.floor(Math.random() * DEFAULT_CHARACTERS.length)]
  )

  // Firebase real-time room listener
  const { room, loading: roomLoading, error: roomError } = useRoomData(roomCode)

  // ── Navigation ──────────────────────────────────────────────
  const go = useCallback((s) => {
    setNavHistory(h => [...h, s])
    setScreen(s)
  }, [])

  const back = useCallback(() => {
    setNavHistory(h => {
      const next = h.slice(0, -1)
      setScreen(next[next.length - 1] || 'home')
      return next
    })
  }, [])

  const goHome = useCallback(() => {
    setNavHistory(['home'])
    setScreen('home')
    setRoomCode(null)
    setJoinError(null)
  }, [])

  const setMyName = useCallback((name) => {
    setMyNameStore(name)
  }, [setMyNameStore])

  // ── Room actions ─────────────────────────────────────────────
  const createRoom = useCallback(async () => {
    if (!isConfigured) {
      // Demo mode — skip Firebase
      go('create')
      return
    }
    const code = generateRoomCode()
    setRoomCode(code)
    await fbCreateRoom(code, myId, myName || 'Host')
    go('create')
  }, [myId, myName, go])

  const joinRoom = useCallback(async (code) => {
    if (!isConfigured) {
      go('create')
      return
    }
    setJoining(true)
    setJoinError(null)
    const result = await fbJoinRoom(code, myId, myName || 'Player')
    setJoining(false)
    if (result.ok) {
      setRoomCode(code)
      go('create')
    } else {
      setJoinError(result.error)
    }
  }, [myId, myName, go])

  const startGame = useCallback(async () => {
    if (!isConfigured || !room) {
      // Demo mode
      go('my-qr')
      return
    }
    await fbStartGame(roomCode, room.players)
    go('my-qr')
  }, [room, roomCode, go])

  const askQuestion = useCallback(async (text) => {
    if (!isConfigured || !roomCode) return
    await fbAskQuestion(roomCode, myId, myName || 'Player', text)
  }, [roomCode, myId, myName])

  const answerQuestion = useCallback(async (questionId, answer, nextTurnId) => {
    if (!isConfigured || !roomCode) return
    await fbAnswerQuestion(roomCode, questionId, answer, nextTurnId)
  }, [roomCode])

  const addScore = useCallback(async () => {
    if (!isConfigured || !roomCode) return
    await fbAddScore(roomCode, myId)
    await fbFinishGame(roomCode)
  }, [roomCode, myId])

  // ── Derived room state ────────────────────────────────────────
  const players = useMemo(() => {
    if (!room?.players) return DEFAULT_PLAYERS
    return Object.entries(room.players).map(([pid, p]) => ({
      id: pid, name: p.name, score: p.score || 0,
      characterJSON: p.characterJSON,
      isMe: pid === myId,
      color: PLAYER_COLORS[Object.keys(room.players).indexOf(pid) % PLAYER_COLORS.length],
      initial: (p.name || '?')[0].toUpperCase(),
    }))
  }, [room, myId])

  const myPlayer = players.find(p => p.isMe)

  const activeCharacter = useMemo(() => {
    if (!isConfigured) return demoCharacter
    if (!myPlayer?.characterJSON) return null
    try { return JSON.parse(myPlayer.characterJSON) } catch { return null }
  }, [myPlayer, demoCharacter])

  const questions = useMemo(() => {
    if (!room?.questions) return []
    return Object.entries(room.questions).map(([id, q]) => ({ id, ...q }))
      .sort((a, b) => a.askedAt - b.askedAt)
  }, [room])

  const currentTurnId = room?.game?.currentTurn || (players[0]?.id)
  const isMyTurn = currentTurnId === myId

  const amHost = room?.host === myId || !isConfigured

  // ── Entity management (characters list) ──────────────────────
  const addCharacter = useCallback((char) => {
    setCharacters(cs => [...cs, { ...char, id: Date.now().toString(), liked: false }])
  }, [setCharacters])
  const removeCharacter = useCallback((id) => {
    setCharacters(cs => cs.filter(c => c.id !== id))
  }, [setCharacters])
  const toggleLike = useCallback((id) => {
    setCharacters(cs => cs.map(c => c.id === id ? { ...c, liked: !c.liked } : c))
  }, [setCharacters])

  return (
    <GameContext.Provider value={{
      myId, myName, setMyName,
      screen, go, back, goHome,
      roomCode,
      room, roomLoading, roomError,
      players, myPlayer, amHost,
      activeCharacter,
      questions, currentTurnId, isMyTurn,
      createRoom, joinRoom, startGame,
      askQuestion, answerQuestion, addScore,
      joining, joinError, setJoinError,
      characters, addCharacter, removeCharacter, toggleLike,
      isOnline: isConfigured,
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}

const PLAYER_COLORS = ['#F5A623', '#3a7d6e', '#8b5cf6', '#e74c3c', '#0ea5e9', '#10b981', '#f43f5e', '#a16207']
