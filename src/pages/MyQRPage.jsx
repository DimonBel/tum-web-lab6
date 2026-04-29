import { useState } from 'react'
import NavBar from '../components/NavBar'
import QRCode from '../components/QRCode'
import { useGame } from '../context/GameContext'

export default function MyQRPage() {
  const { go, back, activeCharacter, myName } = useGame()
  const [peeking, setPeeking] = useState(false)

  const qrValue = activeCharacter
    ? JSON.stringify({ name: activeCharacter.name, emoji: activeCharacter.emoji, category: activeCharacter.category })
    : null

  return (
    <div className="screen active">
      <NavBar title="Your Character" onBack={back} />
      <div className="screen-body" style={{ alignItems: 'center', gap: 18 }}>
        <div className="banner banner-warn" style={{ width: '100%' }}>
          🙈 <strong>Don't look!</strong> Your character is hidden.<br />
          Show this QR to other players — they'll scan it to see who you are.
        </div>

        {/* QR display */}
        <div style={{
          background: '#fff', borderRadius: 20, padding: 20,
          border: '2px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative', alignSelf: 'center',
        }}>
          <QRCode value={qrValue} size={196} />
          {peeking && activeCharacter && (
            <div style={{
              position: 'absolute', inset: 16,
              background: 'rgba(255,255,255,0.97)',
              borderRadius: 12,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }} className="fade-in">
              <div style={{ fontSize: 44 }}>{activeCharacter.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#222' }}>{activeCharacter.name}</div>
              <div style={{ fontSize: 13, color: '#999' }}>{activeCharacter.category}</div>
            </div>
          )}
        </div>

        {myName && (
          <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>
            Player: {myName}
          </div>
        )}

        <button className="btn btn-ghost"
          style={{ padding: '10px 24px', borderRadius: 12 }}
          onMouseDown={() => setPeeking(true)} onMouseUp={() => setPeeking(false)}
          onTouchStart={() => setPeeking(true)} onTouchEnd={() => setPeeking(false)}>
          👁 Peek (hold)
        </button>

        <div style={{ marginTop: 'auto', width: '100%' }}>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: 17 }}
            onClick={() => go('scan-player')}>
            ✓ I'm Ready — Scan Others
          </button>
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }}
            onClick={() => go('gameplay')}>
            Skip scan → Go to Game
          </button>
        </div>
      </div>
    </div>
  )
}
