import { useGame } from '../context/GameContext'

export default function WrongPage() {
  const { go, goHome } = useGame()
  return (
    <div className="screen active">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 28, gap: 16 }}>
        <div style={{ fontSize: 64, lineHeight: 1 }}>😬</div>
        <div style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', color: 'var(--text-primary)' }}>
          Not quite!
        </div>
        <div className="banner banner-error" style={{ width: '100%', textAlign: 'center' }}>
          Your guess was wrong. Keep asking questions!
        </div>
        <div className="card" style={{ width: '100%' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Hint: think about</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4, color: 'var(--text-primary)' }}>
            — their era and origin —
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, width: '100%', marginTop: 8 }}>
          <button className="btn btn-secondary" style={{ flex: 2 }} onClick={() => go('gameplay')}>
            ← Keep Playing
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={goHome}>Exit</button>
        </div>
      </div>
    </div>
  )
}
