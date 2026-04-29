import { useState } from 'react'
import NavBar from '../components/NavBar'
import Avatar from '../components/Avatar'
import QRCode from '../components/QRCode'
import { useGame } from '../context/GameContext'

const STATUS_COLOR = { host: 'badge-orange', ready: 'badge-green', joining: 'badge-gray' }
const STATUS_LABEL = { host: '👑 host', ready: 'ready', joining: '…' }

export default function LobbyPage() {
  const { go, back, goHome, players, myId, amHost, startGame, roomCode, isOnline } = useGame()
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  const joinUrl = roomCode
    ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
    : null

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode || '').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl || '').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const playerStatus = (p) => {
    if (isOnline) {
      return p.id === (players[0]?.id) ? 'host' : 'ready'
    }
    return p.isMe ? 'host' : 'ready'
  }

  return (
    <div className="screen active">
      <NavBar title="Lobby" onBack={goHome} />

      <div className="screen-body">
        {/* Room code card */}
        <div className="card-highlight" style={{ textAlign: 'center' }}>
          <div className="label" style={{ marginBottom: 6 }}>Room Code</div>
          <div className="room-code">{roomCode || 'LOCAL'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Share with friends to join
          </div>

          {isOnline && roomCode && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={copyCode}>
                {copied ? '✓ Copied' : '📋 Code'}
              </button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={copyLink}>
                🔗 Link
              </button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}
                onClick={() => setShowQR(v => !v)}>
                {showQR ? 'Hide' : '▦ QR'}
              </button>
            </div>
          )}

          {showQR && joinUrl && (
            <div style={{ marginTop: 14 }}>
              <QRCode value={joinUrl} size={160} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Others scan this to join
              </div>
            </div>
          )}
        </div>

        {/* Players list */}
        <div>
          <div className="label" style={{ marginBottom: 8 }}>
            Players ({players.length}/8)
          </div>
          <div className="card-bordered">
            {players.map((p, i) => {
              const st = playerStatus(p)
              return (
                <div key={p.id} className="player-row"
                  style={{ borderTop: i > 0 ? '1px solid var(--border-light)' : 'none' }}>
                  <Avatar player={p} size={36} />
                  <div style={{ flex: 1, fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
                    {p.name}
                    {p.isMe && <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}> (you)</span>}
                  </div>
                  <span className={`badge ${STATUS_COLOR[st]}`}>{STATUS_LABEL[st]}</span>
                </div>
              )
            })}
            {/* Waiting slot */}
            <div className="player-row" style={{ borderTop: '1px solid var(--border-light)', opacity: 0.38 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: 'var(--text-muted)',
              }}>+</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Waiting for players…</div>
            </div>
          </div>
        </div>

        {/* Start button — only host sees it */}
        <div style={{ marginTop: 'auto' }}>
          {amHost ? (
            <button className="btn btn-primary" style={{ width: '100%', fontSize: 17 }}
              onClick={startGame}>
              ▶ Start Game
            </button>
          ) : (
            <div style={{
              textAlign: 'center', fontSize: 14, color: 'var(--text-muted)',
              padding: '14px', background: 'var(--bg-secondary)', borderRadius: 12,
            }}>
              ⏳ Waiting for the host to start…
            </div>
          )}
          <div style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center', marginTop: 8 }}>
            {amHost ? 'You are the host' : 'You joined the room'}
          </div>
        </div>
      </div>
    </div>
  )
}
