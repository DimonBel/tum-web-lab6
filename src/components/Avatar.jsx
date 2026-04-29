export default function Avatar({ player, size = 36 }) {
  const color = player.color || '#F5A623'
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color + '22',
      border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38, color, flexShrink: 0,
    }}>
      {player.initial || (player.name || '?')[0].toUpperCase()}
    </div>
  )
}
