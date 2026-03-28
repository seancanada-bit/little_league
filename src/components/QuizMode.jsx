import { useState, useEffect } from 'react'
import { QUESTIONS } from '../data/questions.js'

const API_BASE = '/sandbox/baseball-coach/api'

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizMode() {
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('bb_player') || '')
  const [nameInput, setNameInput] = useState('')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState([])
  const [phase, setPhase] = useState('name') // name | playing | done

  useEffect(() => {
    if (playerName) {
      setPhase('playing')
      setQuestions(shuffle(QUESTIONS).slice(0, 8))
    }
  }, [])

  const startQuiz = () => {
    if (!nameInput.trim()) return
    const name = nameInput.trim()
    setPlayerName(name)
    localStorage.setItem('bb_player', name)
    setQuestions(shuffle(QUESTIONS).slice(0, 8))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
  }

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
        body: JSON.stringify({ name: playerName, score: finalScore, total: questions.length })
      })
      const res = await fetch(`${API_BASE}/scores.php`)
      const data = await res.json()
      setLeaderboard(data.scores || [])
    } catch (e) {
      // API not available in dev — graceful degradation
    }
  }

  const restartQuiz = () => {
    setQuestions(shuffle(QUESTIONS).slice(0, 8))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setPhase('playing')
  }

  if (phase === 'name') {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-64">
        <div className="text-6xl mb-4">🧠</div>
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">Baseball Quiz!</h2>
        <p className="text-emerald-300 text-sm mb-6 text-center">Test what you know about baseball plays and positions!</p>
        <input
          type="text"
          placeholder="What's your name?"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && startQuiz()}
          className="w-full max-w-xs bg-emerald-800 border-2 border-emerald-600 rounded-xl px-4 py-3 text-white text-center text-lg mb-4 focus:outline-none focus:border-yellow-400"
        />
        <button
          onClick={startQuiz}
          disabled={!nameInput.trim()}
          className="bg-yellow-400 text-emerald-900 font-bold text-lg px-8 py-3 rounded-2xl hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-40"
        >
          Let's Play! ⚾
        </button>
      </div>
    )
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
            <p className="text-emerald-300 text-sm">Score for {playerName}</p>
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
