import { useEffect, useRef, useState } from 'react'

const DIAMOND_W = 500
const DIAMOND_H = 480

function lerp(a, b, t) {
  return a + (b - a) * Math.max(0, Math.min(1, t))
}

function getBallPos(waypoints, t) {
  if (!waypoints || waypoints.length < 2) return waypoints?.[0] ?? { x: 250, y: 390 }
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1]
    const curr = waypoints[i]
    if (t <= curr.t) {
      const segT = curr.t === prev.t ? 1 : (t - prev.t) / (curr.t - prev.t)
      return {
        x: lerp(prev.x, curr.x, segT),
        y: lerp(prev.y, curr.y, segT)
      }
    }
  }
  return waypoints[waypoints.length - 1]
}

function getRunnerPos(runner, t) {
  const segT = runner.endT === runner.startT
    ? 1
    : (t - runner.startT) / (runner.endT - runner.startT)
  return {
    x: lerp(runner.from.x, runner.to.x, Math.max(0, Math.min(1, segT))),
    y: lerp(runner.from.y, runner.to.y, Math.max(0, Math.min(1, segT)))
  }
}

export default function PlayAnimation({ play, playing, onDone, currentStep }) {
  const [time, setTime] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)
  const totalDuration = 3.0

  useEffect(() => {
    if (playing) {
      startRef.current = null
      const animate = (ts) => {
        if (!startRef.current) startRef.current = ts
        const elapsed = (ts - startRef.current) / 1000
        setTime(elapsed)
        if (elapsed < totalDuration + 0.5) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          onDone?.()
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(rafRef.current)
      setTime(0)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  const { animation } = play
  const ballPos = getBallPos(animation.ball, time)

  return (
    <svg viewBox={`0 0 ${DIAMOND_W} ${DIAMOND_H}`} className="w-full" style={{ maxHeight: '55vw' }}>
      {/* ── GRASS + MOWING STRIPES ── */}
      <defs>
        <pattern id="playGrass" patternUnits="userSpaceOnUse" width="500" height="40">
          <rect width="500" height="40" fill="#1A6B2E"/>
          <rect width="500" height="20" fill="#1E7A34"/>
        </pattern>
        <radialGradient id="playDirt" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#9A6840"/>
          <stop offset="100%" stopColor="#6B4423"/>
        </radialGradient>
      </defs>
      <rect width="500" height="480" fill="url(#playGrass)"/>

      {/* ── FOUL LINES (through 1B and 3B) ── */}
      <line x1="250" y1="400" x2="500" y2="150" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"/>
      <line x1="250" y1="400" x2="0" y2="150" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"/>

      {/* ── INFIELD DIRT (horseshoe arc) ── */}
      <path d="M 360,290 A 110,110 0 1,0 140,290 L 250,400 Z" fill="url(#playDirt)"/>

      {/* ── BASE PATH LINES ── */}
      <line x1="250" y1="170" x2="360" y2="290" stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>
      <line x1="360" y1="290" x2="250" y2="400" stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>
      <line x1="250" y1="400" x2="140" y2="290" stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>
      <line x1="140" y1="290" x2="250" y2="170" stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>

      {/* ── PITCHER'S MOUND ── */}
      <ellipse cx="250" cy="258" rx="22" ry="17" fill="#7A5030" stroke="#5A3820" strokeWidth="2"/>
      <rect x="241" y="254" width="18" height="5" rx="1.5" fill="#F8F4E8" stroke="#ddd" strokeWidth="0.5"/>

      {/* ── BASES ── */}
      <rect x="238" y="158" width="24" height="24" rx="2" fill="white" stroke="#ccc" strokeWidth="1.5" transform="rotate(45,250,170)"/>
      <rect x="348" y="278" width="24" height="24" rx="2" fill="white" stroke="#ccc" strokeWidth="1.5" transform="rotate(45,360,290)"/>
      <rect x="128" y="278" width="24" height="24" rx="2" fill="white" stroke="#ccc" strokeWidth="1.5" transform="rotate(45,140,290)"/>
      <polygon points="237,392 263,392 263,408 250,418 237,408" fill="white" stroke="#ccc" strokeWidth="1.5"/>

      {/* Position labels */}
      {[
        { label: 'P',  x: 250, y: 250 },
        { label: 'C',  x: 250, y: 430 },
        { label: '1B', x: 390, y: 290 },
        { label: '2B', x: 310, y: 195 },
        { label: '3B', x: 115, y: 290 },
        { label: 'SS', x: 185, y: 200 },
        { label: 'LF', x: 115, y: 110 },
        { label: 'CF', x: 250, y: 65  },
        { label: 'RF', x: 388, y: 110 },
      ].map(p => (
        <text
          key={p.label}
          x={p.x}
          y={p.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(134,239,172,0.6)"
          fontSize="12"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          {p.label}
        </text>
      ))}

      {/* Runners */}
      {animation.runners && animation.runners.map((runner, i) => {
        if (time < runner.startT) return null
        const rp = getRunnerPos(runner, time)
        return (
          <g key={i}>
            <circle cx={rp.x} cy={rp.y} r="14" fill={runner.color} opacity="0.9" />
            <text
              x={rp.x}
              y={rp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
              fontFamily="system-ui"
            >
              RUN
            </text>
          </g>
        )
      })}

      {/* Ball */}
      {playing || time > 0 ? (
        <g>
          <circle cx={ballPos.x} cy={ballPos.y} r="10" fill="white" stroke="#999" strokeWidth="1.5" />
          <path
            d={`M ${ballPos.x - 4},${ballPos.y - 2} Q ${ballPos.x},${ballPos.y - 6} ${ballPos.x + 4},${ballPos.y - 2}`}
            fill="none" stroke="#e74c3c" strokeWidth="1.5"
          />
          <path
            d={`M ${ballPos.x - 4},${ballPos.y + 2} Q ${ballPos.x},${ballPos.y + 6} ${ballPos.x + 4},${ballPos.y + 2}`}
            fill="none" stroke="#e74c3c" strokeWidth="1.5"
          />
        </g>
      ) : (
        <g>
          <circle
            cx={animation.ball[0].x}
            cy={animation.ball[0].y}
            r="10"
            fill="white"
            stroke="#999"
            strokeWidth="1.5"
          />
          <path
            d={`M ${animation.ball[0].x - 4},${animation.ball[0].y - 2} Q ${animation.ball[0].x},${animation.ball[0].y - 6} ${animation.ball[0].x + 4},${animation.ball[0].y - 2}`}
            fill="none" stroke="#e74c3c" strokeWidth="1.5"
          />
          <path
            d={`M ${animation.ball[0].x - 4},${animation.ball[0].y + 2} Q ${animation.ball[0].x},${animation.ball[0].y + 6} ${animation.ball[0].x + 4},${animation.ball[0].y + 2}`}
            fill="none" stroke="#e74c3c" strokeWidth="1.5"
          />
        </g>
      )}
    </svg>
  )
}
