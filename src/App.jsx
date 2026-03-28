import { useState, useEffect } from 'react'
import { PlayerProvider, usePlayer } from './context/PlayerContext.jsx'
import { TeamProvider, useTeam } from './context/TeamContext.jsx'
import PlayerSetup from './components/PlayerSetup.jsx'
import NavBar from './components/NavBar.jsx'
import DiamondView from './components/DiamondView.jsx'
import PlaysLibrary from './components/PlaysLibrary.jsx'
import QuizMode from './components/QuizMode.jsx'
import DecisionGame from './components/DecisionGame.jsx'
import StatsView from './components/StatsView.jsx'
import { isSoundOn, toggleSound } from './utils/sounds'

function AppInner() {
  const { player } = usePlayer()
  const { team } = useTeam()
  const [activeTab, setActiveTab] = useState('diamond')
  const [soundOn, setSoundOn] = useState(isSoundOn())
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!player) return
    // Streak logic
    const today = new Date().toDateString()
    const last = localStorage.getItem('baseball_lastPlayed')
    const currentStreak = parseInt(localStorage.getItem('baseball_streak') || '0')
    if (last === today) {
      setStreak(currentStreak)
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const newStreak = last === yesterday ? currentStreak + 1 : 1
      localStorage.setItem('baseball_streak', newStreak)
      localStorage.setItem('baseball_lastPlayed', today)
      setStreak(newStreak)
    }
  }, [player])

  if (!player) return <PlayerSetup />

  const handleSoundToggle = () => {
    const on = toggleSound()
    setSoundOn(on)
  }

  const renderTab = () => {
    switch(activeTab) {
      case 'diamond': return <DiamondView playerName={player.first_name} />
      case 'plays':   return <PlaysLibrary playerName={player.first_name} />
      case 'quiz':    return <QuizMode playerName={player.first_name} playerId={player.id} />
      case 'throw':   return <DecisionGame playerName={player.first_name} playerId={player.id} />
      case 'stats':   return <StatsView playerName={player.first_name} playerId={player.id} />
      default:        return <DiamondView playerName={player.first_name} />
    }
  }

  return (
    <div className="min-h-screen">
      <NavBar active={activeTab} onChange={setActiveTab} />

      {/* Header */}
      <header className="lg:ml-48 sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{background: 'rgba(10,22,40,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(245,200,66,0.1)'}}>
        <div className="flex items-center gap-2">
          <span className="font-display text-yellow-400 text-xl tracking-wider">COACH YOGI</span>
          {team && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background: 'rgba(46,94,168,0.2)', color: '#60a5fa', border: '1px solid rgba(46,94,168,0.3)'}}>
              {team.team_name}
            </span>
          )}
          {streak > 1 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{background: 'rgba(255,107,107,0.2)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.3)'}}>
              🔥 {streak} day streak!
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-yellow-300">Hey, {player.first_name}!</span>
          <button onClick={handleSoundToggle} className="text-xl opacity-70 hover:opacity-100 transition-opacity" title={soundOn ? 'Mute sounds' : 'Turn on sounds'}>
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:ml-48 pb-20 lg:pb-6 px-4 pt-4 max-w-4xl mx-auto lg:mx-0">
        <div key={activeTab} className="tab-content">
          {renderTab()}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <TeamProvider>
      <PlayerProvider>
        <AppInner />
      </PlayerProvider>
    </TeamProvider>
  )
}
