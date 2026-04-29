import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import { useGame } from '../context/GameContext'

export default function JoinPage() {
  const { go, back, joinRoom, joining, joinError, setJoinError, isOnline } = useGame()
  const [code, setCode] = useState('')

  // Pre-fill if ?room=... is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const r = params.get('room')
    if (r) setCode(r.toUpperCase())
  }, [])

  const handleJoin = () => {
    if (code.length < 4) return
    if (isOnline) {
      joinRoom(code)
    } else {
      go('create')
    }
  }

  return (
    <div className="screen active">
      <NavBar title="Join Game" onBack={back} />
      <div className="screen-body">
        {!isOnline && (
          <div className="banner banner-warn">
            Firebase not configured — joining will open demo mode instead.
          </div>
        )}

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Room Code</div>
          <input className="input" placeholder="e.g. AB3XK2"
            value={code}
            onChange={e => { setCode(e.target.value.toUpperCase()); setJoinError(null) }}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={8}
            style={{ textAlign: 'center', letterSpacing: 4, fontSize: 20, fontWeight: 700 }}
          />
        </div>

        {joinError && (
          <div className="banner banner-error">{joinError}</div>
        )}

        <button className="btn btn-primary" style={{ width: '100%' }}
          onClick={handleJoin}
          disabled={code.length < 4 || joining}>
          {joining ? 'Joining…' : 'Join Room →'}
        </button>

        <div className="divider-text">or scan room QR</div>

        <div className="card" style={{ textAlign: 'center', cursor: 'pointer', border: '1.5px solid var(--border-light)' }}
          onClick={() => go('scan-room')}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
            Scan Host's QR Code
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Point camera at the QR on the host's screen
          </div>
          <button className="btn btn-ghost"
            style={{ marginTop: 12, padding: '10px 20px', width: '100%' }}>
            Open Camera
          </button>
        </div>
      </div>
    </div>
  )
}
