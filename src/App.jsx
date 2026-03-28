import { useState } from 'react'
import NavBar from './components/NavBar.jsx'
import DiamondView from './components/DiamondView.jsx'
import PlayLibrary from './components/PlayLibrary.jsx'
import QuizMode from './components/QuizMode.jsx'
import AskCoach from './components/AskCoach.jsx'

export default function App() {
  const [tab, setTab] = useState('diamond')

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto relative">
      <header className="bg-emerald-800 px-4 py-3 flex items-center gap-2 shadow-lg">
        <span className="text-3xl">⚾</span>
        <div>
          <h1 className="text-xl font-bold text-yellow-300 leading-tight">Baseball Coach</h1>
          <p className="text-xs text-emerald-200">Learn the game — one play at a time!</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        {tab === 'diamond' && <DiamondView />}
        {tab === 'plays' && <PlayLibrary />}
        {tab === 'quiz' && <QuizMode />}
        {tab === 'coach' && <AskCoach />}
      </main>

      <NavBar tab={tab} setTab={setTab} />
    </div>
  )
}
