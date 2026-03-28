import { useEffect, useRef } from 'react'

const COLORS = ['#F5C842', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']

export default function Confetti({ active, count = 60 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!active || !containerRef.current) return
    const container = containerRef.current
    container.innerHTML = ''

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div')
      piece.className = 'confetti-piece'
      piece.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: 0;
        background: ${COLORS[Math.floor(Math.random() * COLORS.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        --duration: ${1 + Math.random() * 1.5}s;
        --delay: ${Math.random() * 0.8}s;
        --rotation: ${360 + Math.random() * 720}deg;
        --drift: ${(Math.random() - 0.5) * 200}px;
      `
      container.appendChild(piece)
    }

    const timer = setTimeout(() => { container.innerHTML = '' }, 3000)
    return () => clearTimeout(timer)
  }, [active, count])

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" aria-hidden="true" />
}
