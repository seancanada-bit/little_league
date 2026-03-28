import { useState } from 'react'
import { scenarios } from '../data/scenarios.js'
import { usePlayer } from '../context/PlayerContext.jsx'
import Confetti from './Confetti.jsx'
import { playSound } from '../utils/sounds'

const API_BASE = '/sandbox/baseball-coach/api'

// SVG diamond coordinates (250×240 viewBox, scaled from 500×480 master)
const BASE_SVG_POSITIONS = {
  home:    { cx: 125, cy: 200 },
  first:   { cx: 180, cy: 145 },
  second:  { cx: 125, cy: 85  },
  third:   { cx: 70,  cy: 145 },
  pitcher: { cx: 125, cy: 129 },
  hold:    { cx: 125, cy: 129 },
}

const OPTION_LABELS = {
  first:  '🔵 Throw to 1st',
  second: '🔵 Throw to 2nd',
  third:  '🔵 Throw to 3rd',
  home:   '🔵 Throw Home!',
  hold:   '🟡 Hold the Ball!',
}

const DIFFICULTY_STYLES = {
  easy:   { bg: 'rgba(22,101,52,0.25)',   text: '#4ade80', border: 'rgba(74,222,128,0.3)',  label: 'Easy'   },
  medium: { bg: 'rgba(133,77,14,0.25)',   text: '#F5C842', border: 'rgba(245,200,66,0.3)',  label: 'Medium' },
  hard:   { bg: 'rgba(127,29,29,0.25)',   text: '#f87171', border: 'rgba(248,113,113,0.3)', label: 'Hard'   },
}

function DiamondSVG({ runners, ballPos, ballVisible }) {
  return (
    <svg viewBox="0 0 250 240" className="w-full max-w-xs mx-auto">
      <defs>
        <pattern id="gameGrass" patternUnits="userSpaceOnUse" width="250" height="20">
          <rect width="250" height="20" fill="#1A6B2E"/>
          <rect width="250" height="10" fill="#1E7A34"/>
        </pattern>
        <radialGradient id="gameDirt" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#9A6840"/>
          <stop offset="100%" stopColor="#6B4423"/>
        </radialGradient>
      </defs>
      {/* Grass */}
      <rect width="250" height="240" fill="url(#gameGrass)"/>
      {/* Foul lines (through 1B and 3B) */}
      <line x1="125" y1="200" x2="250" y2="75" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
      <line x1="125" y1="200" x2="0" y2="75" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5"/>
      {/* Infield dirt (horseshoe arc) */}
      <path d="M 180,145 A 55,55 0 1,0 70,145 L 125,200 Z" fill="url(#gameDirt)"/>
      {/* Base paths */}
      <line x1="125" y1="85" x2="180" y2="145" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <line x1="180" y1="145" x2="125" y2="200" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <line x1="125" y1="200" x2="70" y2="145" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      <line x1="70" y1="145" x2="125" y2="85" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      {/* Pitcher mound */}
      <ellipse cx="125" cy="129" rx="11" ry="8.5" fill="#7A5030" stroke="#5A3820" strokeWidth="1"/>
      <rect x="120.5" y="127" width="9" height="2.5" rx="0.75" fill="#F8F4E8"/>
      {/* Bases */}
      <rect x="119" y="79" width="12" height="12" rx="1" fill="white" stroke="#ccc" strokeWidth="1" transform="rotate(45,125,85)"/>
      <rect x="174" y="139" width="12" height="12" rx="1" fill="white" stroke="#ccc" strokeWidth="1" transform="rotate(45,180,145)"/>
      <rect x="64" y="139" width="12" height="12" rx="1" fill="white" stroke="#ccc" strokeWidth="1" transform="rotate(45,70,145)"/>
      {/* Home plate pentagon */}
      <polygon points="118.5,196 131.5,196 131.5,204 125,209 118.5,204" fill="white" stroke="#ccc" strokeWidth="1"/>
      {/* Base labels */}
      <text x="125" y="68" textAnchor="middle" fill="#F5C842" fontSize="9" fontWeight="bold" fontFamily="system-ui">2B</text>
      <text x="198" y="149" textAnchor="middle" fill="#F5C842" fontSize="9" fontWeight="bold" fontFamily="system-ui">1B</text>
      <text x="52" y="149" textAnchor="middle" fill="#F5C842" fontSize="9" fontWeight="bold" fontFamily="system-ui">3B</text>
      <text x="125" y="225" textAnchor="middle" fill="#F5C842" fontSize="9" fontWeight="bold" fontFamily="system-ui">Home</text>
      {/* Runners */}
      {runners.first  && <circle cx={BASE_SVG_POSITIONS.first.cx}  cy={BASE_SVG_POSITIONS.first.cy}  r="10" fill="#F5C842" stroke="#C9A227" strokeWidth="2" />}
      {runners.second && <circle cx={BASE_SVG_POSITIONS.second.cx} cy={BASE_SVG_POSITIONS.second.cy} r="10" fill="#F5C842" stroke="#C9A227" strokeWidth="2" />}
      {runners.third  && <circle cx={BASE_SVG_POSITIONS.third.cx}  cy={BASE_SVG_POSITIONS.third.cy}  r="10" fill="#F5C842" stroke="#C9A227" strokeWidth="2" />}
      {/* Animated ball */}
      {ballVisible && (
        <circle
          cx={ballPos.cx} cy={ballPos.cy} r="6"
          fill="white" stroke="#ddd" strokeWidth="1"
          style={{
            transition: 'cx 0.6s ease-out, cy 0.6s ease-out',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          }}
        />
      )}
    </svg>
  )
}

function ScenarioCard({ scenario, onSelect }) {
  const diff = DIFFICULTY_STYLES[scenario.difficulty] || DIFFICULTY_STYLES.easy
  return (
    <button
      onClick={() => onSelect(scenario)}
      className="w-full text-left card p-3 transition-all active:scale-95"
      style={{ borderColor: diff.border }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-white font-semibold text-sm">{scenario.title}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
          style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
          {diff.label}
        </span>
      </div>
    </button>
  )
}

export default function DecisionGame({ playerName, playerId }) {
  const { player } = usePlayer()
  const [selected, setSelected] = useState(null)
  const [answer, setAnswer] = useState(null)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [ballPos, setBallPos] = useState({ cx: 125, cy: 140 })
  const [ballVisible, setBallVisible] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)

  const handleSelect = (scenario) => {
    setSelected(scenario)
    setAnswer(null)
    setBallPos({ cx: 125, cy: 129 })
    setBallVisible(false)
    setShowResult(false)
    setConfettiActive(false)
  }

  const handleAnswer = async (option) => {
    if (answer !== null) return
    setAnswer(option)
    const correct = option === selected.correct

    // Animate ball
    setBallVisible(true)
    // Force a reflow so the initial position is rendered before we animate
    const target = BASE_SVG_POSITIONS[option] || BASE_SVG_POSITIONS.home
    // Use a tiny delay so the transition fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setBallPos(target)
      })
    })

    setTimeout(() => {
      setShowResult(true)
      setBallVisible(false)
      if (correct) {
        setSessionCorrect(c => c + 1)
        playSound('correct')
        setConfettiActive(true)
        setTimeout(() => setConfettiActive(false), 3000)
      } else {
        playSound('wrong')
      }
    }, 700)

    setSessionTotal(t => t + 1)

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
        // graceful degradation
      }
    }
  }

  const handleNext = () => {
    setSelected(null)
    setAnswer(null)
    setShowResult(false)
    setBallVisible(false)
    setConfettiActive(false)
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
    const diff = DIFFICULTY_STYLES[selected.difficulty] || DIFFICULTY_STYLES.easy

    return (
      <div>
        <Confetti active={confettiActive} count={40} />

        <button
          onClick={() => { setSelected(null); setAnswer(null); setShowResult(false); playSound('tap') }}
          className="flex items-center gap-1 text-sm font-semibold mb-4 transition-colors"
          style={{ color: '#94a3b8' }}
        >
          ← Back to list
        </button>

        {/* Diamond */}
        <div className="grass-bg rounded-2xl overflow-hidden mb-4"
          style={{ border: '2px solid rgba(245,200,66,0.2)', padding: '12px 8px 8px' }}>
          <DiamondSVG runners={selected.runners} ballPos={ballPos} ballVisible={ballVisible} />
        </div>

        {/* Situation */}
        <div className="card p-4 mb-3">
          <div className="flex flex-wrap items-center gap-3 text-sm mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
              {diff.label}
            </span>
            <span style={{ color: '#94a3b8' }}>
              ⚡ <strong className="text-white">{selected.outs} out{selected.outs !== 1 ? 's' : ''}</strong>
            </span>
            <span style={{ color: '#94a3b8' }}>
              🏃 Runners:{' '}
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

        <p className="font-display text-xl text-yellow-400 mb-3">
          Where should the throw go?
        </p>

        {/* Answer buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {selected.options.map(opt => {
            let bg = 'rgba(15,30,58,0.8)'
            let border = 'rgba(46,94,168,0.4)'
            let textColor = '#F8F4E8'

            if (answer !== null) {
              if (opt === selected.correct) {
                bg = 'rgba(22,101,52,0.4)'
                border = 'rgba(74,222,128,0.6)'
              } else if (opt === answer && !isCorrect) {
                bg = 'rgba(127,29,29,0.4)'
                border = 'rgba(248,113,113,0.6)'
                textColor = '#fca5a5'
              } else {
                textColor = '#475569'
                border = 'rgba(71,85,105,0.2)'
              }
            }
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={answer !== null}
                className="py-3 px-2 rounded-2xl text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed"
                style={{ background: bg, border: `2px solid ${border}`, color: textColor }}
              >
                {OPTION_LABELS[opt]}
              </button>
            )
          })}
        </div>

        {/* Result — shown after ball animation completes */}
        {showResult && (
          <div>
            <div className="rounded-xl p-4 mb-3"
              style={{
                background: isCorrect ? 'rgba(22,101,52,0.3)' : 'rgba(127,29,29,0.3)',
                border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`
              }}>
              {isCorrect ? (
                <>
                  <p className="text-2xl mb-1">✅</p>
                  <p className="text-white font-bold mb-1">
                    Perfect play, {player?.first_name || 'slugger'}!
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#86efac' }}>{selected.explanation}</p>
                </>
              ) : (
                <>
                  <p className="text-2xl mb-1">❌</p>
                  <p className="text-white font-bold mb-1">
                    Coach Yogi says: "{selected.yogiTip}"
                  </p>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: '#fca5a5' }}>
                    <strong>Correct play:</strong> {correctLabel} — {selected.explanation}
                  </p>
                </>
              )}
            </div>
            <button onClick={handleNext} className="btn-primary w-full">
              Next Play ➡
            </button>
          </div>
        )}
      </div>
    )
  }

  // --- List View ---
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-display text-3xl text-yellow-400">Where's the Throw?</h2>
        <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
          {playerName ? `${playerName}, test your baseball brain!` : 'Test your baseball brain!'}
        </p>
      </div>

      {/* Session score */}
      <div className="card p-3 mb-5 text-center"
        style={{ border: '1px solid rgba(46,94,168,0.3)' }}>
        <p className="text-sm font-semibold" style={{ color: '#94a3b8' }}>
          Today's score:{' '}
          <span className="text-yellow-400 font-black text-lg">{sessionCorrect}</span>
          {' '}/{' '}
          <span className="text-white font-black text-lg">{sessionTotal}</span>
          {sessionTotal > 0 && (
            <span className="ml-2 text-xs" style={{ color: '#64748b' }}>
              ({Math.round((sessionCorrect / sessionTotal) * 100)}%)
            </span>
          )}
        </p>
      </div>

      {[
        { key: 'easy',   label: 'Easy',   items: byDiff.easy   },
        { key: 'medium', label: 'Medium', items: byDiff.medium },
        { key: 'hard',   label: 'Hard',   items: byDiff.hard   },
      ].map(group => group.items.length > 0 && (
        <div key={group.key} className="mb-5">
          <h3 className="font-display text-sm tracking-widest mb-2"
            style={{ color: DIFFICULTY_STYLES[group.key].text }}>
            {group.label.toUpperCase()}
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
