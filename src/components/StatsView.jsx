import { useState, useEffect } from 'react'
import { usePlayer } from '../context/PlayerContext.jsx'
import { scenarios } from '../data/scenarios.js'
import YogiMascot from './YogiMascot.jsx'
import { playSound } from '../utils/sounds'

const API_BASE = '/sandbox/baseball-coach/api'

const BADGES = [
  { id: 'first_quiz',      label: 'First Quiz!',      icon: '🏅', condition: (s) => s.quiz_count >= 1 },
  { id: 'perfect',         label: 'Perfect Score',    icon: '⭐', condition: (s) => s.best_pct >= 100 },
  { id: 'five_quizzes',    label: 'Quiz Fanatic',     icon: '📚', condition: (s) => s.quiz_count >= 5 },
  { id: 'decision_master', label: 'Decision Master',  icon: '🎯', condition: (s) => s.decision_pct >= 80 },
  { id: 'all_rounder',     label: 'All-Rounder',      icon: '🌟', condition: (s) => s.quiz_count >= 3 && s.decision_pct >= 70 },
]

export default function StatsView({ playerName, playerId }) {
  const { player, clearPlayer } = usePlayer()
  const [quizScores, setQuizScores] = useState([])
  const [decisionStats, setDecisionStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!player?.id) { setLoading(false); return }

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

  // Quiz calculations
  const totalQuizzes = quizScores.length
  const bestScore    = totalQuizzes > 0 ? Math.max(...quizScores.map(s => Number(s.score))) : null
  const bestTotal    = totalQuizzes > 0 ? (quizScores.find(s => Number(s.score) === bestScore)?.total || 8) : 8
  const bestPct      = bestScore !== null ? Math.round((bestScore / bestTotal) * 100) : 0
  const avgPct       = totalQuizzes > 0
    ? Math.round(quizScores.reduce((sum, s) => sum + (Number(s.score) / Number(s.total)) * 100, 0) / totalQuizzes)
    : 0
  const recentFive   = quizScores.slice(0, 5)

  // Decision calculations
  const totalDecAttempts = decisionStats.reduce((sum, d) => sum + d.total, 0)
  const totalDecCorrect  = decisionStats.reduce((sum, d) => sum + d.correct_count, 0)
  const decisionPct      = totalDecAttempts > 0 ? Math.round((totalDecCorrect / totalDecAttempts) * 100) : 0

  const needsPractice = decisionStats.filter(d => d.total > 0 && (d.correct_count / d.total) < 0.5)
  const nailed        = decisionStats.filter(d => d.total > 0 && d.correct_count === d.total)

  const scenarioTitle = (id) => scenarios.find(s => s.id === id)?.title || id

  // Stats object for badge evaluation
  const statsObj = { quiz_count: totalQuizzes, best_pct: bestPct, decision_pct: decisionPct }
  const earnedBadges = BADGES.filter(b => b.condition(statsObj))

  // Overall performance
  const overallPct = (() => {
    const parts = []
    if (totalQuizzes > 0) parts.push(avgPct)
    if (totalDecAttempts > 0) parts.push(decisionPct)
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
    <div>
      {/* Baseball card header */}
      <div className="rounded-2xl overflow-hidden mb-5 shadow-2xl">
        {/* Foil header */}
        <div style={{
          background: 'linear-gradient(135deg, #C9A227 0%, #F5C842 30%, #FFE87C 50%, #F5C842 70%, #C9A227 100%)',
          padding: '16px 20px 12px',
        }}>
          <div className="flex items-center gap-3">
            <YogiMascot size={56} />
            <div>
              <div className="font-display text-3xl leading-tight" style={{ color: '#0F1E3A' }}>
                {player.first_name.toUpperCase()}
              </div>
              <div className="text-xs font-bold tracking-widest" style={{ color: '#5a3800' }}>
                COACH YOGI'S BASEBALL ACADEMY
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ background: 'linear-gradient(135deg, #0F1E3A, #162440)', padding: '16px' }}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'QUIZZES', value: totalQuizzes || '—' },
              { label: 'BEST', value: bestScore !== null ? `${bestScore}/${bestTotal}` : '—' },
              { label: 'AVG', value: totalQuizzes > 0 ? `${avgPct}%` : '—' },
            ].map(stat => (
              <div key={stat.label} className="text-center rounded-xl py-3 px-2"
                style={{ background: 'rgba(46,94,168,0.15)', border: '1px solid rgba(46,94,168,0.2)' }}>
                <p className="font-display text-2xl text-yellow-400">{stat.value}</p>
                <p className="text-xs font-bold tracking-widest mt-0.5" style={{ color: '#64748b' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quiz progress bar */}
          {totalQuizzes > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: '#64748b' }}>
                <span>Quiz Average</span>
                <span className="text-yellow-400 font-bold">{avgPct}%</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{
                  width: `${avgPct}%`, height: '100%',
                  background: 'linear-gradient(90deg, #F5C842, #FF6B6B)',
                  borderRadius: 9999, transition: 'width 0.8s ease'
                }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="rounded-xl p-3 mb-4 text-center text-sm"
          style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(248,113,113,0.3)', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="card p-4 mb-4">
              <h3 className="font-display text-xl text-yellow-400 mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map(b => (
                  <div key={b.id} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
                    style={{ background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.25)', color: '#F5C842' }}>
                    <span>{b.icon}</span>
                    <span>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Decision stats */}
          <div className="card p-4 mb-4">
            <h3 className="font-display text-xl text-yellow-400 mb-3">Decision Game</h3>
            {totalDecAttempts === 0 ? (
              <p className="text-sm text-center py-2" style={{ color: '#64748b' }}>
                No decisions yet — try the Throw! tab!
              </p>
            ) : (
              <>
                <div className="text-center mb-3 py-3 rounded-xl"
                  style={{ background: 'rgba(46,94,168,0.15)', border: '1px solid rgba(46,94,168,0.2)' }}>
                  <p className="font-display text-4xl text-yellow-400">{decisionPct}%</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                    Overall Accuracy ({totalDecCorrect}/{totalDecAttempts})
                  </p>
                </div>

                {/* Decision accuracy bar */}
                <div className="mb-3">
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{
                      width: `${decisionPct}%`, height: '100%',
                      background: decisionPct >= 80 ? '#4ade80' : decisionPct >= 50 ? '#F5C842' : '#f87171',
                      borderRadius: 9999, transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>

                {needsPractice.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-bold uppercase mb-2" style={{ color: '#f87171' }}>Keep Practicing:</p>
                    <div className="space-y-1">
                      {needsPractice.map(d => (
                        <div key={d.scenario_id} className="flex justify-between items-center text-sm">
                          <span className="text-xs" style={{ color: '#cbd5e1' }}>{scenarioTitle(d.scenario_id)}</span>
                          <span className="font-bold text-xs" style={{ color: '#f87171' }}>
                            {d.correct_count}/{d.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {nailed.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase mb-2" style={{ color: '#4ade80' }}>Nailed It:</p>
                    <div className="space-y-1">
                      {nailed.map(d => (
                        <div key={d.scenario_id} className="flex justify-between items-center text-sm">
                          <span className="text-xs" style={{ color: '#cbd5e1' }}>{scenarioTitle(d.scenario_id)}</span>
                          <span className="font-bold text-xs" style={{ color: '#4ade80' }}>
                            ✅ {d.correct_count}/{d.total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Recent quiz scores */}
          {recentFive.length > 0 && (
            <div className="card p-4 mb-4">
              <h3 className="font-display text-xl text-yellow-400 mb-3">Recent Quizzes</h3>
              <div className="space-y-2">
                {recentFive.map((s, i) => {
                  const pct = Math.round((Number(s.score) / Number(s.total)) * 100)
                  return (
                    <div key={i} className="flex justify-between items-center py-2"
                      style={{ borderBottom: i < recentFive.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span className="text-xs" style={{ color: '#64748b' }}>
                        {s.played_at ? new Date(s.played_at).toLocaleDateString() : `Game ${i + 1}`}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-16 rounded-full overflow-hidden" style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
                          <div style={{
                            width: `${pct}%`, height: '100%',
                            background: pct >= 80 ? '#4ade80' : pct >= 50 ? '#F5C842' : '#f87171',
                            borderRadius: 9999
                          }} />
                        </div>
                        <span className="text-yellow-300 font-bold text-sm w-16 text-right">
                          {s.score}/{s.total} <span className="text-xs" style={{ color: '#64748b' }}>({pct}%)</span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Coach Yogi message */}
          <div className="card p-4 text-center mb-4"
            style={{ border: '2px solid rgba(245,200,66,0.3)' }}>
            <p className="text-3xl mb-2">{coachEmoji}</p>
            <p className="font-display text-lg text-yellow-400 mb-1">Coach Yogi Says:</p>
            <p className="text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>"{coachMessage}"</p>
          </div>
        </>
      )}

      <button
        onClick={() => { playSound('tap'); clearPlayer() }}
        className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95"
        style={{ border: '2px solid rgba(46,94,168,0.4)', color: '#94a3b8', background: 'transparent' }}
      >
        Switch Players
      </button>
    </div>
  )
}
