import { useState } from 'react'
import { PLAYS } from '../data/plays.js'
import PlayAnimation from './PlayAnimation.jsx'
import { playSound } from '../utils/sounds'

const DIFFICULTY_COLOR = {
  Easy:   { bg: 'rgba(45,138,69,0.3)',  text: '#4ade80',  border: 'rgba(74,222,128,0.4)'  },
  Medium: { bg: 'rgba(245,200,66,0.2)', text: '#F5C842',  border: 'rgba(245,200,66,0.4)'  },
  Hard:   { bg: 'rgba(239,68,68,0.2)',  text: '#f87171',  border: 'rgba(239,68,68,0.4)'   },
}

export default function PlaysLibrary({ playerName }) {
  const [selectedPlay, setSelectedPlay] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const play = selectedPlay ? PLAYS.find(p => p.id === selectedPlay) : null

  const handlePlay = () => {
    playSound('swoosh')
    setCurrentStep(0)
    setPlaying(true)
    let step = 0
    const interval = setInterval(() => {
      step++
      if (step < (play?.steps?.length ?? 0)) {
        setCurrentStep(step)
        playSound('tap')
      } else {
        clearInterval(interval)
        setPlaying(false)
      }
    }, 1000)
  }

  const handleDone = () => {
    setPlaying(false)
    setCurrentStep((play?.steps?.length ?? 1) - 1)
  }

  if (play) {
    const diff = DIFFICULTY_COLOR[play.difficulty] || DIFFICULTY_COLOR.Easy
    return (
      <div>
        <button
          onClick={() => { setSelectedPlay(null); setPlaying(false); setCurrentStep(0); playSound('tap') }}
          className="flex items-center gap-1 text-sm font-semibold mb-4 transition-colors"
          style={{ color: '#94a3b8' }}
        >
          ← Back to plays
        </button>

        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-3xl text-yellow-400">{play.emoji} {play.title}</h2>
            <span className="text-xs px-2 py-1 rounded-full font-semibold"
              style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
              {play.difficulty}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>{play.description}</p>
        </div>

        {/* Animation area */}
        <div className="grass-bg rounded-2xl overflow-hidden border border-yellow-400/20 shadow-xl mb-4" style={{ minHeight: 200 }}>
          <PlayAnimation
            play={play}
            playing={playing}
            onDone={handleDone}
            currentStep={currentStep}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2 mb-4">
          {play.steps.map((step, i) => {
            const isActive = i <= currentStep && (playing || currentStep > 0)
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl transition-all"
                style={{
                  background: isActive ? 'rgba(245,200,66,0.1)' : 'rgba(15,30,58,0.6)',
                  border: isActive ? '1px solid rgba(245,200,66,0.3)' : '1px solid rgba(255,255,255,0.05)'
                }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                  style={{
                    background: isActive ? '#F5C842' : 'rgba(46,94,168,0.4)',
                    color: isActive ? '#0F1E3A' : '#94a3b8'
                  }}>
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{step.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{step.note}</p>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handlePlay}
          disabled={playing}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {playing ? '▶ Playing...' : '▶ Watch the Play!'}
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-3xl text-yellow-400">Play Library</h2>
        <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
          {playerName ? `${playerName}, pick a play to see it come to life!` : 'Pick a play to see it come to life!'}
        </p>
      </div>

      <div className="space-y-3">
        {PLAYS.map(p => {
          const diff = DIFFICULTY_COLOR[p.difficulty] || DIFFICULTY_COLOR.Easy
          return (
            <button
              key={p.id}
              onClick={() => { setSelectedPlay(p.id); setPlaying(false); setCurrentStep(0); playSound('tap') }}
              className="w-full card p-4 text-left transition-all active:scale-95 hover:border-yellow-400/40"
              style={{ borderColor: 'rgba(245,200,66,0.1)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
                  {p.difficulty}
                </span>
              </div>
              <h3 className="font-display text-xl text-yellow-400">{p.title}</h3>
              <p className="text-xs mt-1 line-clamp-2" style={{ color: '#94a3b8' }}>{p.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
