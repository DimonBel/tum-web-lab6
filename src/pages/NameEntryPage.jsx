import { useState } from 'react'

export default function NameEntryPage({ onConfirm }) {
  const [name, setName] = useState('')

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onConfirm(trimmed)
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', padding: '32px 24px', gap: 28,
      background: 'var(--bg)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 16 }}>🎭</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>Who Am I? AR</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
          Augmented Reality Edition
        </div>
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label className="label" style={{ marginBottom: 4 }}>Your name</label>
        <input
          className="input"
          style={{ fontSize: 18, padding: '15px 16px', textAlign: 'center', fontWeight: 700 }}
          placeholder="e.g. Alice"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
          maxLength={20}
        />
        <button className="btn btn-primary" style={{ width: '100%', fontSize: 17 }}
          onClick={submit} disabled={!name.trim()}>
          Let's Play →
        </button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>
        Your name is saved locally on this device.
      </div>
    </div>
  )
}
