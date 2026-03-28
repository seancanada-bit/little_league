import { useState, useEffect } from 'react'
import { usePlayer } from '../context/PlayerContext.jsx'
import { scenarios } from '../data/scenarios.js'

const API_BASE = '/sandbox/baseball-coach/api'

export default function StatsView() {
  const { player, clearPlayer } = usePlayer()
  const [quizScores, setQuizScores] = useState([])
  const [decisionStats, setDecisionStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!player?.id) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const [quizRes, decRes] = await Promise.all([
          fetch(`${API_BASE}/scores.php?player_id=${player.id}`),
          fetch(`${API_BASE}/decisions.php?player_id=${player.id}`),
        ])
        const quizData = await quizRes.json()
        const decData  = await decRes.json()
        setQuizScores(quizData.scores || [])
        setDecisionStats(Array.isArray(decData) ? decData : [])
      } catch (e) {
        setError('Could not load stats — are you offline?')
      }
      setLoading(false)
    }

    fetchStats()
  }, [player])

  if (!player) return null

  // --- Quiz calculations ---
  const totalQuizzes = quizScores.length
  const bestScore    = totalQuizzes > 0
    ? Math.max(...quizScores.map(s => Number(s.score)))
    : null
  const bestTotal    = totalQuizzes > 0
    ? quizScores.find(s => Number(s.score) === bestScore)?.total || 8
    : 8
  const avgPct       = totalQuizzes > 0
    ? Math.round(quizScores.reduce((sum, s) => sum + (Number(s.score) / Number(s.total)) * 100, 0) / totalQuizzes)
    : null
  const recentFive   = quizScores.slice(0, 5)

  // --- Decision calculations ---
  const totalDecAttempts = decisionStats.reduce((sum, d) => sum + d.total, 0)
  const totalDecCorrect  = decisionStats.reduce((sum, d) => sum + d.correct_count, 0)
  const overallAccuracy  = totalDecAttempts > 0
    ? Math.round((totalDecCorrect / totalDecAttempts) * 100)
    : null

  // Scenarios with accuracy < 50% (need practice)
  const needsPractice = decisionStats.filter(d => d.total > 0 && (d.correct_count / d.total) < 0.5)
  // Scenarios with 100% accuracy
  const nailed        = decisionStats.filter(d => d.total > 0 && d.correct_count === d.total)

  // Get scenario title by id
  const scenarioTitle = (id) => {
    const found = scenarios.find(s => s.id === id)
    return found ? found.title : id
  }

  // Overall performance message
  const overallPct = (() => {
    const parts = []
    if (avgPct !== null) parts.push(avgPct)
    if (overallAccuracy !== null) parts.push(overallAccuracy)
    if (parts.length === 0) return null
    return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length)
  })()

  let coachMessage, coachEmoji
  if (overallPct === null) {
    coachMessage = "Get out there and start playing! Every pro started at zero."
    coachEmoji = '⚾'
  } else if (overallPct >= 85) {
    coachMessage = "You are a baseball genius! The big leagues are calling your name!"
    coachEmoji = '🏆'
  } else if (overallPct >= 70) {
    coachMessage = "Really solid baseball! Keep grinding and you will be unstoppable!"
    coachEmoji = '⭐'
  } else if (overallPct >= 50) {
    coachMessage = "Good effort, slugger! Every mistake makes you smarter. Keep it up!"
    coachEmoji = '💪'
  } else {
    coachMessage = "Nobody becomes a pro overnight! Check the plays library and keep practicing!"
    coachEmoji = '📚'
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-black text-yellow-300 text-center mb-1">
        📊 {player.first_name}'s Baseball Card
      </h2>
      <p className="text-emerald-400 text-xs text-center mb-5">Your personal stats with Coach Yogi</p>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-900 border border-red-600 rounded-xl p-3 mb-4 text-center">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* --- Quiz Stats --- */}
          <section className="mb-5">
            <h3 className="text-yellow-300 font-bold text-sm uppercase tracking-wide mb-2">
              🧠 Quiz Stats
            </h3>

            {totalQuizzes === 0 ? (
              <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-4 text-center text-emerald-400 text-sm">
                No quizzes yet — head to the Quiz tab!
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-yellow-300">{totalQuizzes}</p>
                    <p className="text-emerald-300 text-xs mt-1">Quizzes Played</p>
                  </div>
                  <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-yellow-300">
                      {bestScore !== null ? `${bestScore}/${bestTotal}` : '—'}
                    </p>
                    <p className="text-emerald-300 text-xs mt-1">Best Score</p>
                  </div>
                  <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3 text-center">
                    <p className="text-2xl font-black text-yellow-300">
                      {avgPct !== null ? `${avgPct}%` : '—'}
                    </p>
                    <p className="text-emerald-300 text-xs mt-1">Average</p>
                  </div>
                </div>

                {recentFive.length > 0 && (
                  <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3">
                    <p className="text-emerald-300 text-xs font-bold uppercase mb-2">Recent Scores</p>
                    <div className="space-y-1">
                      {recentFive.map((s, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-emerald-300 text-xs">
                            {s.played_at ? new Date(s.played_at).toLocaleDateString() : `Game ${i + 1}`}
                          </span>
                          <span className="text-yellow-300 font-bold">
                            {s.score}/{s.total}{' '}
                            <span className="text-emerald-400 font-normal text-xs">
                              ({Math.round((Number(s.score) / Number(s.total)) * 100)}%)
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          {/* --- Decision Game Stats --- */}
          <section className="mb-5">
            <h3 className="text-yellow-300 font-bold text-sm uppercase tracking-wide mb-2">
              🎯 Decision Game Stats
            </h3>

            {totalDecAttempts === 0 ? (
              <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-4 text-center text-emerald-400 text-sm">
                No decisions yet — try the Throw! tab!
              </div>
            ) : (
              <>
                <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3 text-center mb-3">
                  <p className="text-3xl font-black text-yellow-300">{overallAccuracy}%</p>
                  <p className="text-emerald-300 text-xs mt-1">
                    Overall Accuracy ({totalDecCorrect}/{totalDecAttempts} correct)
                  </p>
                </div>

                {needsPractice.length > 0 && (
                  <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3 mb-2">
                    <p className="text-red-400 text-xs font-bold uppercase mb-2">Keep Practicing:</p>
                    <ul className="space-y-1">
                      {needsPractice.map(d => (
                        <li key={d.scenario_id} className="flex justify-between items-center text-sm">
                          <span className="text-white text-xs">{scenarioTitle(d.scenario_id)}</span>
                          <span className="text-red-400 font-bold text-xs">
                            {d.correct_count}/{d.total}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {nailed.length > 0 && (
                  <div className="bg-emerald-800 border border-emerald-700 rounded-xl p-3">
                    <p className="text-green-400 text-xs font-bold uppercase mb-2">You've Nailed It:</p>
                    <ul className="space-y-1">
                      {nailed.map(d => (
                        <li key={d.scenario_id} className="flex justify-between items-center text-sm">
                          <span className="text-white text-xs">{scenarioTitle(d.scenario_id)}</span>
                          <span className="text-green-400 font-bold text-xs">
                            ✅ {d.correct_count}/{d.total}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Coach Yogi message */}
          <div className="bg-emerald-800 border-2 border-yellow-400 rounded-2xl p-4 text-center mb-5">
            <p className="text-3xl mb-2">{coachEmoji}</p>
            <p className="text-yellow-300 font-bold text-sm">Coach Yogi says:</p>
            <p className="text-white text-sm mt-1">"{coachMessage}"</p>
          </div>
        </>
      )}

      {/* Switch Players button */}
      <button
        onClick={clearPlayer}
        className="w-full border-2 border-emerald-600 text-emerald-300 hover:text-white hover:border-emerald-400 font-semibold py-3 rounded-2xl transition-all active:scale-95 text-sm"
      >
        Switch Players
      </button>
    </div>
  )
}
