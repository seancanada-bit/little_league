import { createContext, useContext, useState, useEffect } from 'react'

const TeamContext = createContext(null)

const API_BASE = '/sandbox/baseball-coach/api'

/**
 * TeamProvider — dormant team awareness layer.
 *
 * Right now the app is 100% free with no gating.
 * This context reads an optional ?team= URL param or stored team code,
 * validates it against the backend, and makes team info available
 * to any component that needs it (leaderboard, coach dashboard, etc.)
 *
 * When monetization is turned on later, FeatureGate checks
 * `team.plan` to decide what's locked/unlocked.
 */
export function TeamProvider({ children }) {
  const [team, setTeam] = useState(null)       // null = free / no team
  const [loading, setLoading] = useState(false)

  // On mount: check URL param or localStorage for a team code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const codeFromUrl = params.get('team') || params.get('code')
    const storedCode  = localStorage.getItem('baseball_team_code')
    const code = codeFromUrl || storedCode

    if (!code) return

    setLoading(true)
    fetch(`${API_BASE}/teams.php?code=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(data => {
        if (data.found && data.active && !data.expired) {
          setTeam(data)
          localStorage.setItem('baseball_team_code', code)
          // Clean URL param without reload
          if (codeFromUrl && window.history.replaceState) {
            params.delete('team')
            params.delete('code')
            const clean = params.toString()
            const newUrl = window.location.pathname + (clean ? '?' + clean : '')
            window.history.replaceState({}, '', newUrl)
          }
        } else {
          // Invalid or expired — clear stored code
          localStorage.removeItem('baseball_team_code')
        }
      })
      .catch(() => {
        // Network error — keep going in free mode
      })
      .finally(() => setLoading(false))
  }, [])

  const joinTeam = async (code) => {
    setLoading(true)
    try {
      const r = await fetch(`${API_BASE}/teams.php?code=${encodeURIComponent(code)}`)
      const data = await r.json()
      if (data.found && data.active && !data.expired) {
        setTeam(data)
        localStorage.setItem('baseball_team_code', code)
        return { success: true, team: data }
      }
      return { success: false, reason: data.expired ? 'expired' : 'not_found' }
    } catch {
      return { success: false, reason: 'network' }
    } finally {
      setLoading(false)
    }
  }

  const leaveTeam = () => {
    setTeam(null)
    localStorage.removeItem('baseball_team_code')
  }

  // Helper: is the user on a paid plan?
  const isPaid = team?.plan === 'team' || team?.plan === 'league'

  return (
    <TeamContext.Provider value={{ team, loading, isPaid, joinTeam, leaveTeam }}>
      {children}
    </TeamContext.Provider>
  )
}

export const useTeam = () => useContext(TeamContext)
