import NavBar from '../components/NavBar'
import Avatar from '../components/Avatar'
import { useGame } from '../context/GameContext'

export default function WinPage() {
  const { go, goHome, players, myId, activeCharacter } = useGame()

  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))

  return (
    <div className="screen active" style={{ background: 'var(--bg)' }}>
      <NavBar title="You Won! 🎉" />

      <div className="screen-body" style={{ alignItems: 'center', gap: 18 }}>
        <div style={{ fontSize: 72, lineHeight: 1 }} className="pulse">🎉</div>
        <div style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)' }}>
          You got it!
        </div>

        {activeCharacter && (
          <div className="card-highlight fade-in" style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>You were…</div>
            <div style={{ fontSize: 52 }}>{activeCharacter.emoji}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color: 'var(--text-primary)' }}>
              {activeCharacter.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {activeCharacter.category}
            </div>
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 16, width: '100%' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🏆 Scoreboard</div>
          {sorted.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 16, width: 22 }}>{['🥇','🥈','🥉'][i] || ''}</div>
              <Avatar player={p} size={28} />
              <div style={{ flex: 1, fontWeight: p.id === myId ? 700 : 500, color: 'var(--text-primary)' }}>
                {p.name}{p.id === myId ? ' (you)' : ''}
              </div>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: 13 }}>
                {p.score || 0} pts
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 4 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => go('create')}>
            Play Again
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={goHome}>
            Home
          </button>
        </div>
      </div>
    </div>
  )
}
