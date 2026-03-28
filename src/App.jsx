import { useState } from 'react'
import { PlayerProvider, usePlayer } from './context/PlayerContext.jsx'
import NavBar from './components/NavBar.jsx'
import DiamondView from './components/DiamondView.jsx'
import PlayLibrary from './components/PlayLibrary.jsx'
import QuizMode from './components/QuizMode.jsx'
import DecisionGame from './components/DecisionGame.jsx'
import StatsView from './components/StatsView.jsx'
import PlayerSetup from './components/PlayerSetup.jsx'

function AppInner() {
  const { player } = usePlayer()
  const [tab, setTab] = useState('diamond')

  if (!player) {
    return <PlayerSetup />
  }

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto relative">
      <header className="bg-emerald-800 px-4 py-3 flex items-center gap-2 shadow-lg">
        <span className="text-3xl">⚾</span>
        <div>
          <h1 className="text-xl font-bold text-yellow-300 leading-tight">Coach Yogi's Baseball</h1>
          <p className="text-xs text-emerald-200">
            Hey {player.first_name}! Learn with Coach Yogi! ⚾
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        {tab === 'diamond' && <DiamondView />}
        {tab === 'plays'   && <PlayLibrary />}
        {tab === 'quiz'    && <QuizMode />}
        {tab === 'throw'   && <DecisionGame />}
        {tab === 'stats'   && <StatsView />}
      </main>

      <NavBar tab={tab} setTab={setTab} />
    </div>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <AppInner />
    </PlayerProvider>
  )
}
