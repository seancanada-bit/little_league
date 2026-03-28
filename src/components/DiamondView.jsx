import { useState } from 'react'
import { POSITIONS } from '../data/positions.js'

const DIAMOND_W = 500
const DIAMOND_H = 480

export default function DiamondView() {
  const [selected, setSelected] = useState(null)

  const pos = selected ? POSITIONS.find(p => p.id === selected) : null

  return (
    <div className="p-3">
      <h2 className="text-lg font-bold text-yellow-300 mb-1 text-center">🟫 The Baseball Diamond</h2>
      <p className="text-sm text-emerald-300 text-center mb-3">Tap any player to learn about their position!</p>

      <div className="bg-emerald-950 rounded-2xl overflow-hidden border-2 border-emerald-700 shadow-xl">
        <svg
          viewBox={`0 0 ${DIAMOND_W} ${DIAMOND_H}`}
          className="w-full"
          style={{ maxHeight: '60vw' }}
        >
          {/* Outfield grass */}
          <ellipse cx="250" cy="230" rx="230" ry="200" fill="#2d6a4f" />

          {/* Infield dirt */}
          <polygon points="250,170 360,290 250,400 140,290" fill="#c8a96e" />

          {/* Warning track */}
          <ellipse cx="250" cy="230" rx="230" ry="200" fill="none" stroke="#b8954e" strokeWidth="18" />

          {/* Foul lines */}
          <line x1="250" y1="400" x2="480" y2="70" stroke="white" strokeWidth="1.5" opacity="0.5" />
          <line x1="250" y1="400" x2="20" y2="70" stroke="white" strokeWidth="1.5" opacity="0.5" />

          {/* Base paths */}
          <polygon points="250,170 360,290 250,400 140,290" fill="none" stroke="white" strokeWidth="2.5" />

          {/* Pitcher's mound */}
          <ellipse cx="250" cy="250" rx="22" ry="18" fill="#b8954e" stroke="#a07838" strokeWidth="2" />
          <ellipse cx="250" cy="250" rx="6" ry="5" fill="#d4a866" />

          {/* Second base */}
          <rect x="237" y="163" width="26" height="26" fill="white" stroke="#ccc" strokeWidth="1.5" rx="3" transform="rotate(45 250 176)" />
          {/* First base */}
          <rect x="348" y="277" width="26" height="26" fill="white" stroke="#ccc" strokeWidth="1.5" rx="3" transform="rotate(45 361 290)" />
          {/* Third base */}
          <rect x="128" y="277" width="26" height="26" fill="white" stroke="#ccc" strokeWidth="1.5" rx="3" transform="rotate(45 141 290)" />
          {/* Home plate */}
          <polygon points="250,390 265,405 265,420 235,420 235,405" fill="white" stroke="#ccc" strokeWidth="1.5" />

          {/* Position markers */}
          {POSITIONS.map(p => (
            <g key={p.id} onClick={() => setSelected(selected === p.id ? null : p.id)} style={{ cursor: 'pointer' }}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r="22"
                fill={selected === p.id ? '#f59e0b' : '#1e4d2b'}
                stroke={selected === p.id ? '#fbbf24' : '#4ade80'}
                strokeWidth="2.5"
                className="position-btn transition-all"
              />
              <text
                x={p.cx}
                y={p.cy + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={selected === p.id ? '#1e4d2b' : '#86efac'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="system-ui"
              >
                {p.id}
              </text>
              <text
                x={p.cx}
                y={p.cy + 13}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={selected === p.id ? '#92400e' : '#4ade80'}
                fontSize="8"
                fontFamily="system-ui"
              >
                #{p.number}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Position info card */}
      {pos ? (
        <div className="mt-3 bg-emerald-800 rounded-2xl p-4 border-2 border-yellow-400 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-400 text-emerald-900 rounded-full w-12 h-12 flex items-center justify-center font-black text-lg flex-shrink-0">
              #{pos.number}
            </div>
            <div>
              <h3 className="font-bold text-yellow-300 text-xl">{pos.name}</h3>
              <p className="text-emerald-300 text-sm">Position: {pos.id}</p>
            </div>
          </div>
          <p className="text-white text-sm leading-relaxed mb-3">{pos.description}</p>
          <div className="bg-emerald-900 rounded-xl p-3 text-sm text-emerald-200">
            {pos.fun}
          </div>
        </div>
      ) : (
        <div className="mt-3 bg-emerald-900 rounded-2xl p-4 text-center text-emerald-400 border border-emerald-700">
          <p className="text-4xl mb-2">👆</p>
          <p className="text-sm">Tap any position on the diamond to learn about that player!</p>
        </div>
      )}
    </div>
  )
}
