import { useState, useEffect } from 'react'
import { QUESTIONS } from '../data/questions.js'
import { usePlayer } from '../context/PlayerContext.jsx'
import Confetti from './Confetti.jsx'
import { playSound } from '../utils/sounds'

const API_BASE = '/sandbox/baseball-coach/api'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default function QuizMode({ playerName, playerId }) {
  const { player } = usePlayer()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [phase, setPhase] = useState('playing') // playing | done
  const [confettiActive, setConfettiActive] = useState(false)

  useEffect(() => {
    startQuiz()
  }, [])

  const startQuiz = () => {
    setQuestions(shuffle(QUESTIONS).slice(0, 8))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
    setConfettiActive(false)
  }

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === questions[current]?.answer
    if (correct) {
      setScore(s => s + 1)
      playSound('correct')
      setConfettiActive(false)
      // Small burst
      setTimeout(() => setConfettiActive(true), 50)
      setTimeout(() => setConfettiActive(false), 100)
    } else {
      playSound('wrong')
    }
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setConfettiActive(false)
    }
  }

  const finishQuiz = async () => {
    const finalScore = selected === questions[current]?.answer ? score + 1 : score
    setPhase('done')
    const pct = Math.round((finalScore / questions.length) * 100)

    if (pct === 100) {
      playSound('fanfare')
      setConfettiActive(true)
      setTimeout(() => setConfettiActive(false), 3500)
    } else if (pct >= 70) {
      playSound('correct')
    }

    try {
      await fetch(`${API_BASE}/scores.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: player?.first_name || 'Guest',
          score: finalScore,
          total: questions.length,
          player_id: player?.id || null,
        }),
      })
      const res = await fetch(`${API_BASE}/scores.php`)
      const data = await res.json()
      setLeaderboard(data.scores || [])
    } catch (e) {
      // graceful degradation
    }
  }

  if (phase === 'done') {
    const finalScore = score
    const pct = Math.round((finalScore / questions.length) * 100)
    let message, emoji
    if (pct >= 100) { message = "PERFECT SCORE! You're a baseball genius!"; emoji = "🏆" }
    else if (pct >= 90) { message = "Outstanding! You really know your baseball!"; emoji = "🌟" }
    else if (pct >= 70) { message = "Great work! Keep it up, slugger!"; emoji = "⭐" }
    else if (pct >= 50) { message = "Good effort! Keep practicing and you'll be a pro!"; emoji = "💪" }
    else { message = "Nice try! Check out the plays library and try again!"; emoji = "📚" }

    return (
      <div>
        <Confetti active={confettiActive} count={pct === 100 ? 80 : 30} />

        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{emoji}</div>
          <h2 className="font-display text-3xl text-yellow-400 mb-1">{message}</h2>

          <div className="card inline-block p-6 mt-3"
            style={{ border: '2px solid rgba(245,200,66,0.4)', minWidth: 160 }}>
            <p className="font-display text-5xl text-yellow-400">{finalScore}/{questions.length}</p>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
              {pct}% for {player?.first_name || 'you'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-4 mx-auto max-w-xs rounded-full overflow-hidden h-2"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div style={{
              width: `${pct}%`, height: '100%',
              background: pct === 100 ? 'linear-gradient(90deg,#F5C842,#FF6B6B)' : pct >= 70 ? '#4ade80' : '#F5C842',
              transition: 'width 0.8s ease', borderRadius: '9999px'
            }} />
          </div>
        </div>

        <button onClick={startQuiz} className="btn-primary w-full mb-4">
          Play Again! ⚾
        </button>

        {leaderboard.length > 0 && (
          <div className="card p-4">
            <h3 className="font-display text-xl text-yellow-400 mb-3">Top Scores</h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((s, i) => (
                <div key={i} className="flex justify-between items-center py-2"
                  style={{ borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span className="text-sm" style={{ color: '#cbd5e1' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {s.name}
                  </span>
                  <span className="text-yellow-300 font-bold text-sm">{s.score}/{s.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Playing phase
  const q = questions[current]
  if (!q) return null
  const isCorrect = selected === q.answer
  const progress = ((current) / questions.length) * 100

  return (
    <div>
      <Confetti active={confettiActive} count={20} />

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-display text-lg text-yellow-400">
            Quiz Time, {playerName || 'Slugger'}!
          </span>
          <span className="text-sm font-semibold" style={{ color: '#94a3b8' }}>
            {current + 1}/{questions.length} · ⭐{score}
          </span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.1)' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg, #F5C842, #FF6B6B)',
            transition: 'width 0.4s ease', borderRadius: '9999px'
          }} />
        </div>
      </div>

      {/* Question */}
      <div className="card p-4 mb-4"
        style={{ border: '1px solid rgba(245,200,66,0.15)' }}>
        <p className="text-white font-bold text-base leading-relaxed">{q.question}</p>
      </div>

      {/* Answer cards */}
      <div className="space-y-3 mb-4">
        {q.options.map((opt, i) => {
          let bg = 'rgba(15,30,58,0.8)'
          let border = 'rgba(46,94,168,0.3)'
          let textColor = '#F8F4E8'
          let icon = null

          if (selected !== null) {
            if (i === q.answer) {
              bg = 'rgba(22,101,52,0.4)'
              border = 'rgba(74,222,128,0.6)'
              icon = '✅'
            } else if (i === selected && selected !== q.answer) {
              bg = 'rgba(127,29,29,0.4)'
              border = 'rgba(248,113,113,0.6)'
              textColor = '#fca5a5'
              icon = '❌'
            } else {
              textColor = '#475569'
              border = 'rgba(71,85,105,0.2)'
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className="w-full text-left p-4 rounded-xl transition-all active:scale-98 disabled:cursor-not-allowed"
              style={{
                background: bg,
                border: `2px solid ${border}`,
                color: textColor,
                transform: selected !== null && i !== q.answer && i !== selected ? 'scale(0.98)' : 'scale(1)'
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: selected !== null && i === q.answer ? 'rgba(74,222,128,0.3)' :
                                selected !== null && i === selected ? 'rgba(248,113,113,0.3)' :
                                'rgba(46,94,168,0.3)',
                    color: selected !== null && i === q.answer ? '#4ade80' :
                           selected !== null && i === selected ? '#f87171' :
                           '#93c5fd'
                  }}>
                  {icon || OPTION_LETTERS[i]}
                </span>
                <span className="text-sm font-medium">{opt}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Result + explanation */}
      {selected !== null && (
        <div>
          <div className="rounded-xl p-4 mb-3"
            style={{
              background: isCorrect ? 'rgba(22,101,52,0.3)' : 'rgba(127,29,29,0.3)',
              border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}`
            }}>
            <p className="font-bold text-white text-sm mb-1">
              {isCorrect ? '🎉 Correct! Great job!' : '❌ Not quite — but good try!'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>{q.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="btn-primary w-full"
          >
            {current + 1 >= questions.length ? 'See My Score! 🏆' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  )
}
