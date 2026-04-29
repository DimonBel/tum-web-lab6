import { useState, useEffect, useRef } from 'react'
import NavBar from '../components/NavBar'
import Avatar from '../components/Avatar'
import { useGame } from '../context/GameContext'

export default function GameplayPage() {
  const {
    go, goHome, players, myId, myName,
    activeCharacter, isMyTurn, currentTurnId,
    questions, askQuestion, answerQuestion, addScore,
    isOnline,
  } = useGame()

  const [inputText, setInputText] = useState('')
  const [showGuess, setShowGuess] = useState(false)
  const [guessText, setGuessText] = useState('')
  const chatRef = useRef(null)

  // Fallback local state for demo mode
  const [localHistory, setLocalHistory] = useState([
    { id: '0', by: 'You', byId: myId, text: 'Am I a real person?', answer: 'NO' },
    { id: '1', by: 'You', byId: myId, text: 'Am I from a film?', answer: 'YES' },
  ])
  const [localTurnIdx, setLocalTurnIdx] = useState(0)

  const history = isOnline ? questions : localHistory
  const currentPlayer = isOnline
    ? players.find(p => p.id === currentTurnId) || players[0]
    : players[localTurnIdx % players.length]

  const pendingItem = history.find(q => q.answer === null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [history])

  const submitQuestion = async () => {
    if (!inputText.trim()) return
    if (isOnline) {
      await askQuestion(inputText.trim())
    } else {
      setLocalHistory(h => [...h, { id: Date.now().toString(), by: myName || 'You', byId: myId, text: inputText.trim(), answer: null }])
    }
    setInputText('')
  }

  const answer = async (ans) => {
    if (isOnline && pendingItem) {
      const nextPlayer = players[(players.findIndex(p => p.id === currentTurnId) + 1) % players.length]
      await answerQuestion(pendingItem.id, ans, nextPlayer?.id || currentTurnId)
    } else {
      setLocalHistory(h => h.map((q, i) => i === h.length - 1 ? { ...q, answer: ans } : q))
      if (ans === 'NO') setLocalTurnIdx(i => i + 1)
    }
  }

  const submitGuess = async () => {
    if (!guessText.trim() || !activeCharacter) return
    const correct = guessText.toLowerCase().includes(
      activeCharacter.name.toLowerCase().split(' ')[0]
    )
    setShowGuess(false)
    setGuessText('')
    if (correct) {
      if (isOnline) await addScore()
      go('win')
    } else {
      go('wrong')
    }
  }

  const myTurnNow = isOnline ? isMyTurn : currentPlayer?.isMe

  return (
    <div className="screen active">
      <NavBar title="Gameplay" variant="dark" />

      {/* Turn bar */}
      <div style={{
        background: 'var(--color-secondary)',
        padding: '8px 14px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {players.slice(0, 6).map(p => (
            <div key={p.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              opacity: p.id === (isOnline ? currentTurnId : currentPlayer?.id) ? 1 : 0.45,
              transition: 'opacity 0.25s',
            }}>
              <Avatar player={p} size={30} />
              {p.id === (isOnline ? currentTurnId : currentPlayer?.id) && (
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-primary)' }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
          <div>{myTurnNow ? 'Your turn' : `${currentPlayer?.name}'s turn`}</div>
          <div style={{ fontSize: 11, opacity: 0.65 }}>{history.length} questions asked</div>
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{
        flex: 1, overflowY: 'auto', padding: '12px 14px',
        display: 'flex', flexDirection: 'column', gap: 8,
        background: 'var(--bg-secondary)',
      }}>
        {history.map((item) => (
          <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'flex-start' }}>
              {item.by || item.byId}
            </div>
            <div className="bubble bubble-left">{item.text}</div>
            {item.answer && (
              <div className={`bubble bubble-${item.answer === 'YES' ? 'yes' : 'no'}`}
                style={{ fontSize: 13, fontWeight: 700, padding: '5px 13px' }}>
                {item.answer === 'YES' ? '✓ YES' : '✗ NO'}
              </div>
            )}
          </div>
        ))}

        {/* Yes/No buttons for answering other players' questions */}
        {pendingItem && !myTurnNow && (
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '11px 8px', fontSize: 15 }}
              onClick={() => answer('YES')}>✓ YES</button>
            <button className="btn btn-danger" style={{ flex: 1, padding: '11px 8px', fontSize: 15 }}
              onClick={() => answer('NO')}>✗ NO</button>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        background: 'var(--bg)', borderTop: '1px solid var(--border-light)',
        padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" style={{ flex: 1, padding: '10px 12px', fontSize: 14, borderRadius: 10 }}
            placeholder={myTurnNow ? 'Ask a yes/no question…' : `Waiting for ${currentPlayer?.name}…`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            disabled={!myTurnNow || !!pendingItem}
            onKeyDown={e => e.key === 'Enter' && submitQuestion()}
          />
          <button className="btn btn-primary"
            style={{ padding: '10px 13px', borderRadius: 10, fontSize: 18 }}
            onClick={submitQuestion}
            disabled={!inputText.trim() || !myTurnNow || !!pendingItem}>→</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}
            onClick={() => go('scan-player')}>📷 Scan QR</button>
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
            onClick={() => setShowGuess(true)}>🎯 Guess!</button>
        </div>
      </div>

      {showGuess && (
        <div className="modal-overlay" onClick={() => setShowGuess(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
              Who are you?
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              Type your guess below
            </div>
            <input className="input" placeholder="Character name…"
              value={guessText}
              onChange={e => setGuessText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitGuess()}
              autoFocus />
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={submitGuess}>
              Submit Guess →
            </button>
            <button className="btn btn-ghost" style={{ width: '100%' }}
              onClick={() => setShowGuess(false)}>
              Not ready yet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
