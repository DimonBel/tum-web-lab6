import { useState } from 'react'
import NavBar from '../components/NavBar'
import { useGame } from '../context/GameContext'
import { CATEGORIES } from '../data/characters'

export default function CharactersPage() {
  const { back, characters, addCharacter, removeCharacter, toggleLike } = useGame()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCat, setNewCat] = useState(CATEGORIES[1])
  const [newEmoji, setNewEmoji] = useState('🎭')

  const filtered = characters.filter(c => {
    const matchCat = filter === 'All' || c.category === filter
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const likedCount = characters.filter(c => c.liked).length

  const handleAdd = () => {
    if (!newName.trim()) return
    addCharacter({ name: newName.trim(), category: newCat, emoji: newEmoji })
    setNewName('')
    setNewEmoji('🎭')
    setShowAdd(false)
  }

  return (
    <div className="screen active">
      <NavBar title="Characters" onBack={back}
        rightEl={
          <button className="icon-btn" onClick={() => setShowAdd(true)} title="Add">＋</button>
        }
      />
      <div className="screen-body" style={{ gap: 10 }}>
        {/* Stats */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { label: 'Total', value: characters.length, color: 'var(--text-primary)' },
            { label: 'Liked', value: likedCount, color: 'var(--color-primary)' },
            { label: 'Categories', value: new Set(characters.map(c => c.category)).size, color: 'var(--color-secondary)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: 1, textAlign: 'center', padding: '10px 6px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div className="label" style={{ marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <input className="input" placeholder="🔍 Search…"
          value={search} onChange={e => setSearch(e.target.value)} />

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{
                flexShrink: 0, border: 'none', borderRadius: 20,
                padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: filter === cat ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                color: filter === cat ? '#222' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '28px 0', fontSize: 14 }}>
              No characters found
            </div>
          )}
          {filtered.map(c => (
            <div key={c.id} className={`char-card${c.liked ? ' liked' : ''}`}>
              <div style={{ fontSize: 26 }}>{c.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{c.category}</div>
              </div>
              <button onClick={() => toggleLike(c.id)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, padding: 4 }}
                title={c.liked ? 'Unlike' : 'Like'}>
                {c.liked ? '❤️' : '🤍'}
              </button>
              <button onClick={() => removeCharacter(c.id)}
                style={{ border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 14, padding: 4, color: 'var(--text-muted)' }}
                title="Remove">✕</button>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Add Character</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="input" style={{ width: 60, textAlign: 'center', fontSize: 22, padding: '10px 6px' }}
                value={newEmoji} onChange={e => setNewEmoji(e.target.value)} maxLength={2} />
              <input className="input" style={{ flex: 1 }} placeholder="Name"
                value={newName} onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()} autoFocus />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORIES.slice(1).map(cat => (
                <button key={cat} onClick={() => setNewCat(cat)}
                  style={{
                    border: 'none', borderRadius: 20, padding: '6px 11px',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: newCat === cat ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                    color: newCat === cat ? '#222' : 'var(--text-secondary)',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}
              onClick={handleAdd} disabled={!newName.trim()}>
              Add
            </button>
            <button className="btn btn-ghost" style={{ width: '100%' }}
              onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
