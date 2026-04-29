import { useState, useEffect, useRef, useCallback } from 'react'
import NavBar from '../components/NavBar'
import { useGame } from '../context/GameContext'

export default function ARScanPage({ mode = 'player' }) {
  const { go, back, joinRoom, myName, isOnline } = useGame()
  const [phase, setPhase] = useState('idle')
  const [found, setFound] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [scanProgress, setScanProgress] = useState(0)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const doneRef = useRef(false)

  const stopCamera = useCallback(() => {
    doneRef.current = true
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  const startCamera = async () => {
    setPhase('requesting')
    setErrorMsg('')
    doneRef.current = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setPhase('scanning')
      setScanProgress(0)
      scanLoop()
    } catch (err) {
      setPhase('error')
      setErrorMsg(err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access and try again.'
        : 'Could not open camera: ' + err.message)
    }
  }

  const scanLoop = () => {
    let progress = 0
    const tick = () => {
      if (doneRef.current) return
      progress = Math.min(progress + 3, 100)
      setScanProgress(progress)

      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)

        import('jsqr').then(({ default: jsQR }) => {
          if (doneRef.current) return
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code) {
            handleCode(code.data)
          }
        })
      }

      if (progress >= 100 && !doneRef.current) {
        // Demo fallback: simulate a found result
        stopCamera()
        handleFound({ name: 'Harry Potter', emoji: '🧙', category: 'Book hero', simulated: true })
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const handleCode = (raw) => {
    stopCamera()
    try {
      // Try character JSON
      const data = JSON.parse(raw)
      if (data.name && data.emoji) {
        handleFound(data)
        return
      }
      // Try room join URL: wai://join/ROOMCODE or ?room=ROOMCODE
      if (data.type === 'room') {
        handleRoom(data.code)
        return
      }
    } catch { /* not JSON */ }

    // Try URL with ?room= param
    try {
      const url = new URL(raw)
      const room = url.searchParams.get('room')
      if (room) { handleRoom(room); return }
    } catch { /* not a URL */ }

    // Unknown QR — keep scanning
    if (!doneRef.current) {
      doneRef.current = false
      startCamera()
    }
  }

  const handleFound = (data) => {
    setFound(data)
    setPhase('found')
  }

  const handleRoom = (code) => {
    if (isOnline) joinRoom(code)
    else go('create')
  }

  // ── Found screen ──────────────────────────────────────────────
  if (phase === 'found' && found) {
    return (
      <div className="screen active" style={{ background: '#08080f' }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 28, gap: 18,
        }}>
          <div style={{ fontSize: 48 }}>🎭</div>
          <div style={{ color: 'var(--color-primary)', fontSize: 12, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 1.2 }}>
            {mode === 'room' ? 'Room found!' : "Boris's character"}
          </div>
          <div className="fade-in" style={{
            background: '#fff', borderRadius: 20, padding: '24px 28px',
            textAlign: 'center', width: '100%',
          }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>{found.emoji}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#111' }}>{found.name}</div>
            <div style={{ fontSize: 13, color: '#999', marginTop: 4 }}>
              {found.category}
              {found.simulated && <span style={{ opacity: 0.5, marginLeft: 6 }}>(demo)</span>}
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, textAlign: 'center' }}>
            {mode === 'room'
              ? 'Joining the room…'
              : 'Boris doesn\'t know yet — help them figure it out!'}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }}
            onClick={() => go(mode === 'room' ? 'create' : 'gameplay')}>
            {mode === 'room' ? '→ Enter Lobby' : '← Back to Game'}
          </button>
          <button className="btn btn-outline"
            style={{ width: '100%', color: '#aaa', borderColor: '#333', background: 'transparent' }}
            onClick={() => { setPhase('idle'); setFound(null) }}>
            Scan Another
          </button>
        </div>
      </div>
    )
  }

  // ── Scanner UI ────────────────────────────────────────────────
  return (
    <div className="screen active" style={{ background: '#08080f' }}>
      <NavBar
        title={mode === 'room' ? 'Scan Room QR' : 'Scan Player QR'}
        onBack={() => { stopCamera(); back() }}
        variant="transparent"
      />

      <div className="camera-view">
        <div className="cam-noise" />
        <video ref={videoRef} playsInline muted
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: phase === 'scanning' ? 1 : 0,
            transition: 'opacity 0.4s',
          }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 20,
        }}>
          <div className="scan-frame">
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />
            {phase === 'scanning' && <div className="scan-line" />}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            {phase === 'scanning' && `Scanning… ${scanProgress}%`}
            {phase === 'idle' && 'Point at a QR code'}
            {phase === 'requesting' && 'Opening camera…'}
          </div>
        </div>
      </div>

      <div style={{ background: '#0f0f18', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {phase === 'error' && (
          <div className="banner banner-error">{errorMsg}</div>
        )}
        {phase === 'scanning' && (
          <div style={{ height: 3, background: '#2a2a3a', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--color-primary)',
              width: `${scanProgress}%`, transition: 'width 0.1s', borderRadius: 2 }} />
          </div>
        )}
        {(phase === 'idle' || phase === 'error') && (
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={startCamera}>
            📷 {phase === 'error' ? 'Try Again' : 'Tap to Scan'}
          </button>
        )}
        <button className="btn btn-outline"
          style={{ width: '100%', color: '#888', borderColor: '#2a2a3a', background: 'transparent' }}
          onClick={() => { stopCamera(); back() }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
