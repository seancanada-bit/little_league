import { useState } from 'react'
import { usePlayer } from '../context/PlayerContext.jsx'
import { playSound } from '../utils/sounds'

const API = '/sandbox/baseball-coach/api'

export default function PlayerSetup() {
  const { savePlayer } = usePlayer()
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | returning | new | error
  const [returningData, setReturningData] = useState(null)
  const [error, setError] = useState('')

  const handleNameInput = (e) => {
    const raw = e.target.value.replace(/[^a-zA-Z]/g, '')
    setName(raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase())
    setError('')
  }

  const handleSubmit = async () => {
    if (name.length < 2) { setError('Name needs at least 2 letters!'); return }
    setStatus('loading')
    setError('')
    try {
      const res = await fetch(`${API}/players.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: name }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setStatus('idle')
        return
      }

      if (data.created === false) {
        // Returning player
        setReturningData(data)
        setStatus('returning')
        playSound('correct')
      } else {
        // New player
        setStatus('new')
        playSound('fanfare')
        setTimeout(() => savePlayer({ id: data.id, first_name: data.first_name }), 1800)
      }
    } catch {
      // Offline fallback
      setStatus('new')
      playSound('fanfare')
      setTimeout(() => savePlayer({ id: null, first_name: name }), 1800)
    }
  }

  const handleReturningConfirm = () => {
    playSound('correct')
    savePlayer({ id: returningData.id, first_name: returningData.first_name })
  }

  // Stars background (computed once, stable)
  const stars = Array.from({ length: 20 }, (_, i) => ({
    w: 1 + ((i * 7 + 3) % 3),
    h: 1 + ((i * 11 + 1) % 3),
    top: (i * 13 + 5) % 40,
    left: (i * 17 + 9) % 100,
    dur: 1.5 + (i % 4) * 0.5,
  }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{background: 'linear-gradient(180deg, #0a1628 0%, #1B3A6B 40%, #1A6B2E 100%)'}}>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: `${s.w}px`, height: `${s.h}px`,
              top: `${s.top}%`, left: `${s.left}%`,
              opacity: 0.6,
              animation: `pulse ${s.dur}s ease-in-out infinite`
            }}/>
        ))}
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-3 drop-shadow-2xl" style={{animation: 'bounceIn 0.5s ease-out'}}>&#x26BE;</div>
          <h1 className="font-display text-5xl text-yellow-400 tracking-widest drop-shadow-lg">COACH YOGI</h1>
          <p className="text-blue-300 text-sm mt-1 font-semibold tracking-wide">BASEBALL ACADEMY</p>
        </div>

        {(status === 'idle' || status === 'loading' || status === 'error') && (
          <div className="card p-6 text-center">
            <p className="text-white text-xl mb-5 font-semibold">What's your first name, slugger? ⚾</p>

            {/* Jersey nameplate input */}
            <div className="relative mb-4">
              <div className="rounded-xl overflow-hidden"
                style={{background: 'linear-gradient(135deg, #1B3A6B, #0F1E3A)', border: '2px solid rgba(245,200,66,0.4)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)', position: 'relative'}}>
                {/* Pinstripes overlay */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.04) 18px, rgba(255,255,255,0.04) 19px)'}} />
                <input
                  type="text"
                  value={name}
                  onChange={handleNameInput}
                  onKeyDown={(e) => e.key === 'Enter' && name.length >= 2 && handleSubmit()}
                  placeholder="Your name here"
                  maxLength={20}
                  className="relative z-10 w-full text-center text-2xl py-4 px-4 bg-transparent outline-none"
                  style={{fontFamily: "'Bebas Neue', 'Arial Black', sans-serif", letterSpacing: '0.15em', color: '#F5C842', caretColor: '#F5C842'}}
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-3" style={{animation: 'bounceIn 0.3s ease-out'}}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === 'loading' || name.length < 2}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⚾</span> Checking...
                </span>
              ) : "Let's Play Ball! ⚾"}
            </button>
          </div>
        )}

        {status === 'returning' && returningData && (
          <div className="card p-6 text-center" style={{animation: 'bounceIn 0.5s ease-out'}}>
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-display text-3xl text-yellow-400 mb-2">
              WELCOME BACK,<br/>{returningData.first_name}!
            </h2>
            <p className="mb-4" style={{ color: '#93c5fd' }}>
              You've played{' '}
              <span className="text-yellow-300 font-bold">{returningData.quiz_count || 0}</span>{' '}
              quizzes
              {returningData.quiz_avg > 0 && (
                <> with an average of{' '}
                  <span className="text-yellow-300 font-bold">{Math.round(returningData.quiz_avg)}%</span>
                </>
              )}!
            </p>
            <button onClick={handleReturningConfirm} className="btn-primary w-full">
              Let's Go! ⚾
            </button>
          </div>
        )}

        {status === 'new' && (
          <div className="card p-6 text-center" style={{animation: 'bounceIn 0.5s ease-out'}}>
            <div className="text-5xl mb-3">🎊</div>
            <h2 className="font-display text-3xl text-yellow-400 mb-2">
              WELCOME TO THE TEAM,<br/>{name}!
            </h2>
            <p style={{ color: '#93c5fd' }}>Get ready to learn baseball with Coach Yogi!</p>
            <div className="mt-4 text-2xl animate-spin inline-block">⚾</div>
          </div>
        )}

        <p className="text-center text-xs mt-4 opacity-60" style={{ color: '#60a5fa' }}>
          Coach Yogi's Baseball Academy • Learn &amp; Play!
        </p>
      </div>
    </div>
  )
}
