import { useState } from 'react'
import { usePlayer } from '../context/PlayerContext.jsx'

const API_BASE = '/sandbox/baseball-coach/api'

export default function PlayerSetup() {
  const { savePlayer } = usePlayer()
  const [nameInput, setNameInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [welcomeBack, setWelcomeBack] = useState(null) // {id, first_name, quiz_count, ...}
  const [pendingPlayer, setPendingPlayer] = useState(null)

  const handleNameChange = (e) => {
    // Only allow letters, auto-capitalize first letter
    const raw = e.target.value.replace(/[^A-Za-z]/g, '')
    const capped = raw.length > 0 ? raw.charAt(0).toUpperCase() + raw.slice(1) : ''
    setNameInput(capped)
    setError('')
  }

  const handleSubmit = async () => {
    const trimmed = nameInput.trim()
    if (trimmed.length < 2) {
      setError('Your name needs at least 2 letters, slugger!')
      return
    }
    if (trimmed.length > 20) {
      setError('That name is too long — try a shorter one!')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/players.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: trimmed }),
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      if (data.created === false) {
        // Returning player — show welcome back screen
        setWelcomeBack(data)
        setPendingPlayer({ id: data.id, first_name: data.first_name })
        setLoading(false)
      } else {
        // New player — brief success then auto-proceed
        setPendingPlayer({ id: data.id, first_name: data.first_name })
        setLoading(false)
        setTimeout(() => {
          savePlayer({ id: data.id, first_name: data.first_name })
        }, 1500)
      }
    } catch (e) {
      // API unavailable — allow offline play with a local-only player
      const localPlayer = { id: null, first_name: trimmed }
      setPendingPlayer(localPlayer)
      setLoading(false)
      setTimeout(() => {
        savePlayer(localPlayer)
      }, 1500)
    }
  }

  const handleConfirmWelcomeBack = () => {
    savePlayer(pendingPlayer)
  }

  // Welcome back screen
  if (welcomeBack) {
    return (
      <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-yellow-300 mb-3 text-center">
          Welcome back, {welcomeBack.first_name}!
        </h2>
        <div className="bg-emerald-800 border-2 border-yellow-400 rounded-2xl p-5 mb-6 w-full max-w-xs text-center">
          <p className="text-white text-base mb-2">
            You've played{' '}
            <span className="text-yellow-300 font-bold">{welcomeBack.quiz_count}</span>{' '}
            time{welcomeBack.quiz_count !== 1 ? 's' : ''}.
          </p>
          <p className="text-emerald-300 text-sm">Coach Yogi missed ya! ⚾</p>
        </div>
        <button
          onClick={handleConfirmWelcomeBack}
          className="bg-yellow-400 text-emerald-900 font-bold text-lg px-10 py-3 rounded-2xl hover:bg-yellow-300 active:scale-95 transition-all shadow-lg"
        >
          Let's Go! ⚾
        </button>
      </div>
    )
  }

  // New player success (pendingPlayer set but no welcomeBack)
  if (pendingPlayer && !welcomeBack) {
    return (
      <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center px-6">
        <div className="text-6xl mb-4">⚾</div>
        <h2 className="text-2xl font-bold text-yellow-300 mb-2 text-center">
          You're on the team, {pendingPlayer.first_name}!
        </h2>
        <p className="text-emerald-300 text-center">Getting the dugout ready…</p>
        <div className="mt-6">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  // Main name entry screen
  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center px-6">
      <div className="text-7xl mb-4">⚾</div>
      <h1 className="text-3xl font-black text-yellow-300 mb-1 text-center">
        Coach Yogi's Baseball
      </h1>
      <p className="text-emerald-400 text-sm mb-8 text-center">Learn the game — one play at a time!</p>

      <div className="w-full max-w-xs">
        <p className="text-white text-lg font-bold text-center mb-4">
          What's your name, slugger?
        </p>

        <input
          type="text"
          placeholder="Type your first name…"
          value={nameInput}
          onChange={handleNameChange}
          onKeyDown={e => e.key === 'Enter' && !loading && nameInput.length >= 2 && handleSubmit()}
          maxLength={20}
          className="w-full bg-emerald-800 border-2 border-emerald-600 focus:border-yellow-400 rounded-xl px-4 py-3 text-white text-center text-xl mb-2 focus:outline-none transition-colors"
        />

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || nameInput.length < 2}
          className="w-full bg-yellow-400 text-emerald-900 font-bold text-lg py-3 rounded-2xl hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-40 shadow-lg mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-emerald-900 border-t-transparent rounded-full animate-spin" />
              <span>Loading…</span>
            </>
          ) : (
            "Let's Play Ball! ⚾"
          )}
        </button>

        <p className="text-emerald-500 text-xs text-center mt-4">
          Letters only, 2–20 characters
        </p>
      </div>
    </div>
  )
}
