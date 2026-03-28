import { useState } from 'react'
import { POSITIONS } from '../data/positions.js'
import { playSound } from '../utils/sounds'

const DIAMOND_W = 500
const DIAMOND_H = 480

const YOGI_TIPS = [
  "It ain't over till it's over! Keep your head in the game.",
  "Baseball is 90% mental. The other half is physical!",
  "You can observe a lot by just watching.",
  "When you come to a fork in the road, take it! Always run the bases hard.",
  "If the world were perfect, it wouldn't be. That's why we practice!",
  "It gets late early out there. Stay focused all nine innings.",
  "The future ain't what it used to be — so make your plays count today!",
]

export default function DiamondView({ playerName }) {
  const [selected, setSelected] = useState(null)

  const pos = selected ? POSITIONS.find(p => p.id === selected) : null
  const todaysTip = YOGI_TIPS[new Date().getDay() % YOGI_TIPS.length]

  const handlePositionClick = (id) => {
    playSound('tap')
    setSelected(selected === id ? null : id)
  }

  return (
    <div>
      {/* Yogi tip banner */}
      <div className="mb-4 px-4 py-3 rounded-xl flex items-start gap-3"
        style={{ background: 'rgba(245,200,66,0.08)', border: '1px solid rgba(245,200,66,0.2)' }}>
        <span className="text-xl flex-shrink-0">💬</span>
        <div>
          <span className="font-display text-yellow-400 text-sm tracking-wide">COACH YOGI'S TIP</span>
          <p className="text-white text-sm mt-0.5 leading-relaxed italic">"{todaysTip}"</p>
        </div>
      </div>

      <div className="mb-3">
        <h2 className="font-display text-3xl text-yellow-400">The Baseball Diamond</h2>
        <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
          {playerName ? `Tap any player, ${playerName}!` : 'Tap any player to learn about their position!'}
        </p>
      </div>

      {/* Diamond SVG */}
      <div className="grass-bg rounded-2xl overflow-hidden shadow-xl mb-4"
        style={{ border: '2px solid rgba(245,200,66,0.2)' }}>
        <svg
          viewBox={`0 0 ${DIAMOND_W} ${DIAMOND_H}`}
          className="w-full"
          style={{ maxHeight: '62vw' }}
        >
          {/* Outfield grass */}
          <ellipse cx="250" cy="230" rx="230" ry="200" fill="#1A6B2E" />

          {/* Infield dirt */}
          <polygon points="250,170 360,290 250,400 140,290" fill="#8B5E3C" />

          {/* Warning track */}
          <ellipse cx="250" cy="230" rx="230" ry="200" fill="none" stroke="#6B4423" strokeWidth="18" />

          {/* Foul lines */}
          <line x1="250" y1="400" x2="480" y2="70" stroke="rgba(248,244,232,0.5)" strokeWidth="1.5" />
          <line x1="250" y1="400" x2="20" y2="70" stroke="rgba(248,244,232,0.5)" strokeWidth="1.5" />

          {/* Base paths */}
          <polygon points="250,170 360,290 250,400 140,290" fill="none" stroke="rgba(248,244,232,0.7)" strokeWidth="2.5" />

          {/* Pitcher's mound */}
          <ellipse cx="250" cy="250" rx="22" ry="18" fill="#7A5030" stroke="#5A3820" strokeWidth="2" />
          <ellipse cx="250" cy="250" rx="6" ry="5" fill="#9A6840" />

          {/* Second base */}
          <rect x="237" y="163" width="26" height="26" fill="white" stroke="#ddd" strokeWidth="1.5" rx="3" transform="rotate(45 250 176)" />
          {/* First base */}
          <rect x="348" y="277" width="26" height="26" fill="white" stroke="#ddd" strokeWidth="1.5" rx="3" transform="rotate(45 361 290)" />
          {/* Third base */}
          <rect x="128" y="277" width="26" height="26" fill="white" stroke="#ddd" strokeWidth="1.5" rx="3" transform="rotate(45 141 290)" />
          {/* Home plate */}
          <polygon points="250,390 265,405 265,420 235,420 235,405" fill="white" stroke="#ddd" strokeWidth="1.5" />

          {/* Position markers */}
          {POSITIONS.map(p => {
            const isSelected = selected === p.id
            return (
              <g key={p.id} onClick={() => handlePositionClick(p.id)} style={{ cursor: 'pointer' }}>
                {/* Pulse ring for unselected */}
                {!isSelected && (
                  <circle
                    cx={p.cx} cy={p.cy} r="26"
                    fill="rgba(46,94,168,0.15)"
                    stroke="rgba(46,94,168,0.3)"
                    strokeWidth="1"
                    className="animate-pulse-soft"
                  />
                )}
                {/* Selected glow ring */}
                {isSelected && (
                  <circle
                    cx={p.cx} cy={p.cy} r="30"
                    fill="rgba(245,200,66,0.15)"
                    stroke="rgba(245,200,66,0.5)"
                    strokeWidth="2"
                  />
                )}
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r="22"
                  fill={isSelected ? '#F5C842' : '#0F1E3A'}
                  stroke={isSelected ? '#C9A227' : '#2E5EA8'}
                  strokeWidth="2.5"
                  style={{ transition: 'fill 0.15s, stroke 0.15s' }}
                />
                <text
                  x={p.cx}
                  y={p.cy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? '#0F1E3A' : '#F8F4E8'}
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
                  fill={isSelected ? '#5a3800' : '#2E5EA8'}
                  fontSize="8"
                  fontFamily="system-ui"
                >
                  #{p.number}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Slide-up info sheet */}
      {pos ? (
        <div className="card p-5 animate-slide-up"
          style={{ border: '1px solid rgba(245,200,66,0.3)' }}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-display text-2xl text-yellow-400">{pos.name}</div>
              <div className="text-sm font-semibold" style={{ color: '#93c5fd' }}>#{pos.number} · {pos.abbr || pos.id}</div>
            </div>
            <button
              onClick={() => { setSelected(null); playSound('tap') }}
              className="text-gray-400 text-xl leading-none hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <p className="text-white text-sm leading-relaxed mb-3">{pos.description}</p>
          {pos.fun && (
            <div className="rounded-xl p-3 text-sm"
              style={{ background: 'rgba(46,94,168,0.2)', border: '1px solid rgba(46,94,168,0.3)', color: '#93c5fd' }}>
              💡 {pos.fun}
            </div>
          )}
        </div>
      ) : (
        <div className="card p-5 text-center"
          style={{ border: '1px solid rgba(46,94,168,0.2)' }}>
          <p className="text-3xl mb-2">👆</p>
          <p className="text-sm" style={{ color: '#64748b' }}>Tap any position on the diamond to learn about that player!</p>
        </div>
      )}
    </div>
  )
}
