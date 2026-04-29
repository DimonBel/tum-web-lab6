export default function NavBar({ title, onBack, rightEl, variant = 'primary' }) {
  const classes = {
    primary: 'top-bar',
    dark: 'top-bar top-bar-dark',
    transparent: 'top-bar top-bar-transparent',
  }
  return (
    <div className={classes[variant] || 'top-bar'}>
      <div style={{ width: 36 }}>
        {onBack && (
          <button className="icon-btn" onClick={onBack} aria-label="Back">←</button>
        )}
      </div>
      <span className="top-bar-title">{title}</span>
      <div style={{ width: 36, display: 'flex', justifyContent: 'flex-end' }}>
        {rightEl || null}
      </div>
    </div>
  )
}
