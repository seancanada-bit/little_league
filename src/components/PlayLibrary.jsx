import { useState } from 'react'
import { PLAYS } from '../data/plays.js'
import PlayAnimation from './PlayAnimation.jsx'

const DIFFICULTY_COLOR = {
  Easy: 'bg-green-500',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-500',
}

export default function PlayLibrary() {
  const [selectedPlay, setSelectedPlay] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const play = selectedPlay ? PLAYS.find(p => p.id === selectedPlay) : null

  const handlePlay = () => {
    setCurrentStep(0)
    setPlaying(true)
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < (play?.steps?.length ?? 0)) {
        setCurrentStep(step)
      } else {
        clearInterval(interval)
      }
    }, 1000)
  }

  const handleDone = () => {
    setPlaying(false)
    setCurrentStep((play?.steps?.length ?? 1) - 1)
  }

  if (play) {
    return (
      <div className="p-3">
        <button
          onClick={() => { setSelectedPlay(null); setPlaying(false); setCurrentStep(0) }}
          className="flex items-center gap-1 text-emerald-300 hover:text-white text-sm mb-3"
        >
          ← Back to plays
        </button>

        <h2 className="text-xl font-bold text-yellow-300 mb-1">{play.emoji} {play.title}</h2>
        <p className="text-sm text-emerald-200 mb-3">{play.description}</p>

        <div className="bg-emerald-950 rounded-2xl overflow-hidden border-2 border-emerald-700 shadow-xl mb-3">
          <PlayAnimation
            play={play}
            playing={playing}
            onDone={handleDone}
            currentStep={currentStep}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2 mb-4">
          {play.steps.map((step, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                i <= currentStep && (playing || currentStep > 0)
                  ? 'bg-emerald-700 border border-emerald-500'
                  : 'bg-emerald-900 border border-emerald-800'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                i <= currentStep && (playing || currentStep > 0)
                  ? 'bg-yellow-400 text-emerald-900'
                  : 'bg-emerald-700 text-emerald-300'
              }`}>
                {i + 1}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{step.label}</p>
                <p className="text-emerald-300 text-xs">{step.note}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePlay}
          disabled={playing}
          className={`w-full py-3 rounded-2xl font-bold text-lg transition-all ${
            playing
              ? 'bg-emerald-700 text-emerald-400 cursor-not-allowed'
              : 'bg-yellow-400 text-emerald-900 hover:bg-yellow-300 active:scale-95 pulse-green'
          }`}
        >
          {playing ? '▶ Playing...' : '▶ Watch the Play!'}
        </button>
      </div>
    )
  }

  return (
    <div className="p-3">
      <h2 className="text-lg font-bold text-yellow-300 mb-1">🎬 Play Library</h2>
      <p className="text-sm text-emerald-300 mb-4">Pick a play to see it come to life!</p>
      <div className="space-y-3">
        {PLAYS.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelectedPlay(p.id); setPlaying(false); setCurrentStep(0) }}
            className="w-full bg-emerald-800 hover:bg-emerald-700 active:scale-95 rounded-2xl p-4 text-left transition-all border border-emerald-700 hover:border-yellow-400"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">{p.emoji}</span>
              <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[p.difficulty]}`}>
                {p.difficulty}
              </span>
            </div>
            <h3 className="font-bold text-yellow-300 text-base">{p.title}</h3>
            <p className="text-emerald-300 text-xs mt-1 line-clamp-2">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
