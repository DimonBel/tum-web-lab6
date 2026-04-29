import { useEffect, useRef } from 'react'

const FALLBACK_PATTERN = [
  1,1,1,0,1,0,1,1,1,
  1,0,1,0,0,0,1,0,1,
  1,1,1,0,1,0,1,1,1,
  0,0,0,0,0,1,0,1,0,
  1,0,1,1,0,1,0,0,1,
  0,1,0,0,1,0,0,1,0,
  1,1,1,0,0,1,1,0,1,
  1,0,1,0,1,0,0,1,0,
  1,1,1,0,1,1,1,1,1,
]

export default function QRCode({ value, size = 160, color = 'var(--text-primary)' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!value || !canvasRef.current) return
    import('qrcode').then(QR => {
      QR.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 1,
        color: { dark: color.startsWith('var') ? '#222222' : color, light: '#ffffff' },
      }).catch(() => {})
    })
  }, [value, size, color])

  if (!value) {
    return (
      <div style={{
        width: size, height: size,
        background: '#fff', borderRadius: 12, padding: 12, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(9,1fr)',
        gridTemplateRows: 'repeat(9,1fr)',
        gap: 2,
      }}>
        {FALLBACK_PATTERN.map((v, i) => (
          <div key={i} style={{ borderRadius: 2, background: v ? '#222' : 'transparent' }} />
        ))}
      </div>
    )
  }

  return (
    <canvas ref={canvasRef} width={size} height={size}
      style={{ borderRadius: 12, display: 'block', margin: '0 auto' }} />
  )
}
