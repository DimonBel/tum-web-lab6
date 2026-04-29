import NavBar from '../components/NavBar'
import { useGame } from '../context/GameContext'

const STEPS = [
  { icon: '✏️', title: 'Enter Your Name', desc: 'Each player enters their name when they open the app on their device.' },
  { icon: '🎮', title: 'Create or Join', desc: 'One player creates a room and shares the room code or QR link.' },
  { icon: '🔗', title: 'Join from Any Device', desc: 'Others enter the code or scan the QR — each on their own phone or laptop.' },
  { icon: '🎭', title: 'Get a Character', desc: 'Each player\'s screen shows a secret QR — others scan it to see who they are.' },
  { icon: '📷', title: 'AR Scan', desc: 'Point your camera at another player\'s screen. Their character appears as an AR overlay.' },
  { icon: '❓', title: 'Ask Yes/No Questions', desc: 'All questions appear in a shared real-time chat. Take turns guessing.' },
  { icon: '🎯', title: 'Guess & Win', desc: 'First to guess their own character correctly wins the round!' },
]

export default function HelpPage() {
  const { back } = useGame()
  return (
    <div className="screen active">
      <NavBar title="How to Play" onBack={back} />
      <div className="screen-body" style={{ gap: 16 }}>
        {STEPS.map((s, i) => (
          <div key={i} className="slide-up"
            style={{ display: 'flex', gap: 14, alignItems: 'flex-start', animationDelay: `${i * 0.04}s` }}>
            <div style={{ fontSize: 26, flexShrink: 0, width: 40, textAlign: 'center', marginTop: 1 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.5 }}>
                {s.desc}
              </div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={back}>
            Got it! →
          </button>
        </div>
      </div>
    </div>
  )
}
