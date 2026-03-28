import { useState, useEffect } from 'react'
import { QUESTIONS } from '../data/questions.js'
import { usePlayer } from '../context/PlayerContext.jsx'

const API_BASE = '/sandbox/baseball-coach/api'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizMode() {
  const { player } = usePlayer()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [phase, setPhase] = useState('playing') // playing | done

  useEffect(() => {
    setQuestions(shuffle(QUESTIONS).slice(0, 8))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
  }, [])

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === questions[current]?.answer) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
    }
  }

  const finishQuiz = async () => {
    const finalScore = selected === questions[current]?.answer
      ? score + 1
      : score
    setPhase('done')

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
      // API not available — graceful degradation
    }
  }

  const restartQuiz = () => {
    setQuestions(shuffle(QUESTIONS).slice(0, 8))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
  }

  if (phase === 'done') {
    const pct = Math.round((score / questions.length) * 100)
    let message, emoji
    if (pct >= 90) { message = "You're a baseball genius! Amazing job!"; emoji = "🏆" }
    else if (pct >= 70) { message = "Great work! You really know your baseball!"; emoji = "⭐" }
    else if (pct >= 50) { message = "Good effort! Keep practicing and you'll be a pro!"; emoji = "💪" }
    else { message = "Nice try! Check out the plays library and try again!"; emoji = "📚" }

    return (
      <div className="p-4">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{emoji}</div>
          <h2 className="text-xl font-bold text-yellow-300">{message}</h2>
          <div className="mt-4 bg-emerald-800 rounded-2xl p-4 border-2 border-yellow-400 inline-block">
            <p className="text-4xl font-black text-yellow-300">{score}/{questions.length}</p>
            <p className="text-emerald-300 text-sm">Score for {player?.first_name || 'you'}</p>
          </div>
        </div>

        <button
          onClick={restartQuiz}
          className="w-full bg-yellow-400 text-emerald-900 font-bold text-lg py-3 rounded-2xl mb-4 hover:bg-yellow-300 active:scale-95 transition-all"
        >
          Play Again! ⚾
        </button>

        {leaderboard.length > 0 && (
          <div>
            <h3 className="text-yellow-300 font-bold mb-2">🏆 Top Scores</h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((s, i) => (
                <div key={i} className="flex justify-between items-center bg-emerald-800 rounded-xl p-3">
                  <span className="text-emerald-200">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {s.name}
                  </span>
                  <span className="text-yellow-300 font-bold">{s.score}/{s.total}</span>
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

  return (
    <div className="p-4">
      {/* Quiz header */}
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-yellow-300">
          🧠 Quiz Time, {player?.first_name || 'slugger'}!
        </h2>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 bg-emerald-800 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-emerald-300 text-sm">{current + 1}/{questions.length}</span>
        <span className="text-yellow-300 font-bold text-sm">⭐{score}</span>
      </div>

      <div className="bg-emerald-800 rounded-2xl p-4 mb-4 border border-emerald-700">
        <p className="text-white font-bold text-base leading-relaxed">{q.question}</p>
      </div>

      <div className="space-y-3 mb-4">
        {q.options.map((opt, i) => {
          let style = 'bg-emerald-800 border-emerald-700 text-white'
          if (selected !== null) {
            if (i === q.answer) style = 'bg-green-600 border-green-400 text-white'
            else if (i === selected && selected !== q.answer) style = 'bg-red-700 border-red-500 text-white'
            else style = 'bg-emerald-900 border-emerald-800 text-emerald-500'
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all active:scale-95 ${style}`}
            >
              <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][i]}.</span> {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div>
          <div className={`rounded-xl p-3 mb-3 ${isCorrect ? 'bg-green-800 border border-green-500' : 'bg-red-900 border border-red-600'}`}>
            <p className="font-bold text-white text-sm">{isCorrect ? '🎉 Correct! Great job!' : '❌ Not quite — but good try!'}</p>
            <p className="text-sm text-gray-200 mt-1">{q.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full bg-yellow-400 text-emerald-900 font-bold py-3 rounded-2xl hover:bg-yellow-300 active:scale-95 transition-all"
          >
            {current + 1 >= questions.length ? 'See My Score! 🏆' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  )
}
