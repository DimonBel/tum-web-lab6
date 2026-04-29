import NavBar from '../components/NavBar'
import { useGame } from '../context/GameContext'
import { useTheme } from '../hooks/useTheme'

export default function HomePage() {
  const { go, createRoom, myName, isOnline } = useGame()
  const { theme, toggle } = useTheme()

  return (
    <div className="screen active">
      <NavBar
        title="Who Am I? AR"
        rightEl={
          <div style={{ display: 'flex', gap: 5 }}>
            <button className="icon-btn" onClick={() => go('characters')} title="Characters">🎭</button>
            <button className="icon-btn" onClick={toggle} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="icon-btn" onClick={() => go('help')} title="Help"
              style={{ fontWeight: 800 }}>?</button>
          </div>
        }
      />

      <div className="screen-body" style={{ alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 16 }}>🎭</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            Who Am I?
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>
            Augmented Reality Edition
          </div>
          {myName && (
            <div style={{ marginTop: 10, fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Welcome back, {myName}!
            </div>
          )}
        </div>

        {!isOnline && (
          <div className="banner banner-warn" style={{ width: '100%' }}>
            Running in <strong>demo mode</strong> (Firebase not configured).
            Multiplayer won't sync across devices. See README to set up Firebase.
          </div>
        )}

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary" style={{ width: '100%', fontSize: 17 }}
            onClick={createRoom}>
            ＋ Create Game
          </button>
          <button className="btn btn-secondary" style={{ width: '100%', fontSize: 17 }}
            onClick={() => go('join')}>
            🔗 Join Game
          </button>
        </div>

        <div className="divider-text" style={{ width: '100%' }}>or scan a room QR code</div>

        <button className="btn btn-ghost"
          style={{ width: 58, height: 58, borderRadius: 16, fontSize: 24, padding: 0 }}
          onClick={() => go('scan-room')}>▦</button>

        <div style={{ marginTop: 'auto', fontSize: 12, color: 'var(--text-faint)' }}>
          Up to 8 players · v2.0
        </div>
      </div>
    </div>
  )
}
