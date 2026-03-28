import { useState, useEffect } from 'react'
import { scenarios } from '../data/scenarios.js'
import { usePlayer } from '../context/PlayerContext.jsx'

const API_BASE = '/sandbox/baseball-coach/api'

// SVG diamond coordinates (250x250 viewBox)
const BASE_POSITIONS = {
  home:   { cx: 125, cy: 220 },
  first:  { cx: 210, cy: 140 },
  second: { cx: 125, cy: 55  },
  third:  { cx: 40,  cy: 140 },
}

const OPTION_LABELS = {
  first:  '🔵 Throw to 1st',
  second: '🔵 Throw to 2nd',
  third:  '🔵 Throw to 3rd',
  home:   '🔵 Throw Home!',
  hold:   '🟡 Hold the Ball!',
}

const DIFFICULTY_STYLES = {
  easy:   { badge: 'bg-green-700 text-green-100',  label: 'Easy'   },
  medium: { badge: 'bg-yellow-600 text-yellow-100', label: 'Medium' },
  hard:   { badge: 'bg-red-700 text-red-100',       label: 'Hard'   },
}

function DiamondSVG({ runners }) {
  return (
    <svg viewBox="0 0 250 250" className="w-full max-w-[220px] mx-auto">
      {/* Outfield grass */}
      <ellipse cx="125" cy="130" rx="115" ry="110" fill="#2d6a4f" />

      {/* Infield dirt */}
      <polygon points="125,55 210,140 125,220 40,140" fill="#c8a96e" />

      {/* Base paths */}
      <polygon points="125,55 210,140 125,220 40,140" fill="none" stroke="white" strokeWidth="1.5" />

      {/* Pitcher mound */}
      <ellipse cx="125" cy="140" rx="12" ry="10" fill="#b8954e" stroke="#a07838" strokeWidth="1" />

      {/* Bases as small squares */}
      {/* Second base */}
      <rect x="116" y="46" width="18" height="18" fill="white" rx="2"
        transform="rotate(45 125 55)" />
      {/* First base */}
      <rect x="201" y="131" width="18" height="18" fill="white" rx="2"
        transform="rotate(45 210 140)" />
      {/* Third base */}
      <rect x="31" y="131" width="18" height="18" fill="white" rx="2"
        transform="rotate(45 40 140)" />
      {/* Home plate */}
      <polygon points="125,212 133,220 133,228 117,228 117,220" fill="white" stroke="#ccc" strokeWidth="1" />

      {/* Base labels */}
      <text x="125" y="35" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="system-ui">2B</text>
      <text x="228" y="144" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="system-ui">1B</text>
      <text x="22"  y="144" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="system-ui">3B</text>
      <text x="125" y="245" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold" fontFamily="system-ui">Home</text>

      {/* Runners as filled amber circles */}
      {runners.first  && <circle cx={BASE_POSITIONS.first.cx}  cy={BASE_POSITIONS.first.cy}  r="10" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />}
      {runners.second && <circle cx={BASE_POSITIONS.second.cx} cy={BASE_POSITIONS.second.cy} r="10" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />}
      {runners.third  && <circle cx={BASE_POSITIONS.third.cx}  cy={BASE_POSITIONS.third.cy}  r="10" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />}
    </svg>
  )
}

function ScenarioCard({ scenario, onSelect }) {
  const diff = DIFFICULTY_STYLES[scenario.difficulty] || DIFFICULTY_STYLES.easy
  return (
    <button
      onClick={() => onSelect(scenario)}
      className="w-full text-left bg-emerald-800 border border-emerald-700 hover:border-yellow-400 rounded-xl p-3 transition-all active:scale-95"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-white font-semibold text-sm">{scenario.title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${diff.badge}`}>
          {diff.label}
        </span>
      </div>
    </button>
  )
}

export default function DecisionGame() {
  const { player } = usePlayer()
  const [selected, setSelected] = useState(null) // current scenario object
  const [answer, setAnswer] = useState(null)      // the option the player chose
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)

  const handleSelect = (scenario) => {
    setSelected(scenario)
    setAnswer(null)
  }

  const handleAnswer = async (option) => {
    if (answer !== null) return
    setAnswer(option)
    const correct = option === selected.correct
    if (correct) setSessionCorrect(c => c + 1)
    setSessionTotal(t => t + 1)

    // Save to API
    if (player?.id) {
      try {
        await fetch(`${API_BASE}/decisions.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player_id: player.id,
            scenario_id: selected.id,
            correct: correct ? 1 : 0,
          }),
        })
      } catch (e) {
        // graceful degradation if API unavailable
      }
    }
  }

  const handleNext = () => {
    setSelected(null)
    setAnswer(null)
  }

  // Group scenarios by difficulty
  const byDiff = { easy: [], medium: [], hard: [] }
  scenarios.forEach(s => {
    if (byDiff[s.difficulty]) byDiff[s.difficulty].push(s)
    else byDiff.easy.push(s)
  })

  // --- Play View ---
  if (selected) {
    const isCorrect = answer === selected.correct
    const correctLabel = OPTION_LABELS[selected.correct] || selected.correct

    return (
      <div className="p-4">
        {/* Back button */}
        <button
          onClick={() => { setSelected(null); setAnswer(null) }}
          className="flex items-center gap-1 text-emerald-300 hover:text-white text-sm mb-4 transition-colors"
        >
          ← Back to list
        </button>

        {/* SVG Diamond */}
        <div className="bg-emerald-950 rounded-2xl p-3 border border-emerald-700 mb-4">
          <DiamondSVG runners={selected.runners} />
        </div>

        {/* Situation card */}
        <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-3 text-sm text-emerald-300 mb-2">
            <span>
              ⚡ <strong className="text-white">{selected.outs} out{selected.outs !== 1 ? 's' : ''}</strong>
            </span>
            <span>
              🏃 Runners on:{' '}
              <strong className="text-white">
                {[
                  selected.runners.first  && '1st',
                  selected.runners.second && '2nd',
                  selected.runners.third  && '3rd',
                ].filter(Boolean).join(', ') || 'none'}
              </strong>
            </span>
          </div>
          <p className="text-white text-sm leading-relaxed">{selected.situation}</p>
        </div>

        {/* Question */}
        <p className="text-yellow-300 font-bold text-base mb-3">
          🤔 Where should the throw go?
        </p>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {selected.options.map(opt => {
            let style = 'bg-emerald-800 border-2 border-emerald-700 text-white hover:border-yellow-400'
            if (answer !== null) {
              if (opt === selected.correct) {
                style = 'bg-green-700 border-2 border-green-400 text-white'
              } else if (opt === answer && !isCorrect) {
                style = 'bg-red-800 border-2 border-red-600 text-white'
              } else {
                style = 'bg-emerald-900 border-2 border-emerald-800 text-emerald-600'
              }
            }
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={answer !== null}
                className={`py-3 px-2 rounded-2xl text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed ${style}`}
              >
                {OPTION_LABELS[opt]}
              </button>
            )
          })}
        </div>

        {/* Result card */}
        {answer !== null && (
          <div>
            <div className={`rounded-xl p-4 mb-3 border ${isCorrect ? 'bg-green-800 border-green-500' : 'bg-red-900 border-red-600'}`}>
              {isCorrect ? (
                <>
                  <p className="text-2xl mb-1">✅</p>
                  <p className="text-white font-bold mb-1">
                    Perfect play, {player?.first_name || 'slugger'}!
                  </p>
                  <p className="text-green-200 text-sm">{selected.explanation}</p>
                </>
              ) : (
                <>
                  <p className="text-2xl mb-1">❌</p>
                  <p className="text-white font-bold mb-1">
                    Coach Yogi says: "{selected.yogiTip}"
                  </p>
                  <p className="text-red-200 text-sm mt-2">
                    <strong>Correct play:</strong> {correctLabel} — {selected.explanation}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-yellow-400 text-emerald-900 font-bold py-3 rounded-2xl hover:bg-yellow-300 active:scale-95 transition-all"
            >
              Next Play ➡
            </button>
          </div>
        )}
      </div>
    )
  }

  // --- List View ---
  return (
    <div className="p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-black text-yellow-300">🎯 Where's the Throw?</h2>
        <p className="text-emerald-300 text-sm">
          {player?.first_name ? `${player.first_name}, test your baseball brain!` : 'Test your baseball brain!'}
        </p>
      </div>

      {/* Session score */}
      <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3 mb-5 text-center">
        <p className="text-white text-sm font-semibold">
          ✅ <span className="text-yellow-300 font-black text-lg">{sessionCorrect}</span>
          {' / '}
          <span className="text-white font-black text-lg">{sessionTotal}</span>
          {' '}today
        </p>
      </div>

      {/* Grouped scenarios */}
      {[
        { key: 'easy',   label: '🟢 Easy',   items: byDiff.easy   },
        { key: 'medium', label: '🟡 Medium',  items: byDiff.medium },
        { key: 'hard',   label: '🔴 Hard',    items: byDiff.hard   },
      ].map(group => (
        <div key={group.key} className="mb-5">
          <h3 className="text-emerald-300 font-bold text-sm uppercase tracking-wide mb-2">
            {group.label}
          </h3>
          <div className="space-y-2">
            {group.items.map(s => (
              <ScenarioCard key={s.id} scenario={s} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
