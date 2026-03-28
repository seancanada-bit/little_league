import { createContext, useContext, useState, useEffect } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('baseball_player')
    if (saved) {
      try { setPlayer(JSON.parse(saved)) } catch(e) { localStorage.removeItem('baseball_player') }
    }
  }, [])

  const savePlayer = (p) => {
    setPlayer(p)
    localStorage.setItem('baseball_player', JSON.stringify(p))
  }

  const clearPlayer = () => {
    setPlayer(null)
    localStorage.removeItem('baseball_player')
  }

  return (
    <PlayerContext.Provider value={{ player, savePlayer, clearPlayer }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
