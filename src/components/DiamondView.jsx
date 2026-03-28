import { useState } from 'react'
import { POSITIONS } from '../data/positions.js'
import { playSound } from '../utils/sounds'

// Key field coordinates — foul lines PASS THROUGH 1B and 3B exactly
const HOME  = { x: 250, y: 400 }
const FIRST = { x: 360, y: 290 }
const SECOND= { x: 250, y: 170 }
const THIRD = { x: 140, y: 290 }

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
      <div className="rounded-2xl overflow-hidden shadow-xl mb-4"
        style={{ border: '2px solid rgba(245,200,66,0.2)' }}>
        <svg viewBox="0 0 500 480" className="w-full" style={{ maxHeight: '62vw', display: 'block' }}>
          <defs>
            {/* Mowing stripes — alternating light/dark horizontal bands */}
            <pattern id="grassStripes" patternUnits="userSpaceOnUse" width="500" height="40">
              <rect width="500" height="40" fill="#1A6B2E"/>
              <rect width="500" height="20" fill="#1E7A34"/>
            </pattern>
            {/* Infield dirt radial gradient for depth */}
            <radialGradient id="dirtGrad" cx="50%" cy="65%" r="55%">
              <stop offset="0%" stopColor="#9A6840"/>
              <stop offset="100%" stopColor="#6B4423"/>
            </radialGradient>
            {/* Infield arc clip (everything above home) */}
            <clipPath id="outfieldOnly">
              <rect x="0" y="0" width="500" height="480"/>
            </clipPath>
          </defs>

          {/* ── GRASS BACKGROUND ── */}
          <rect width="500" height="480" fill="url(#grassStripes)"/>

          {/* ── FOUL LINES (chalk white, pass exactly through 1B and 3B) ──
               Right: home(250,400) → 1B(360,290) → (500,150)
               Left:  home(250,400) → 3B(140,290) → (0,150)          */}
          <line x1="250" y1="400" x2="500" y2="150"
            stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"/>
          <line x1="250" y1="400" x2="0" y2="150"
            stroke="rgba(255,255,255,0.9)" strokeWidth="2.5"/>

          {/* ── INFIELD DIRT (horseshoe arc — no oval warning track) ──
               Arc from 1B(360,290) counterclockwise over 2B(250,170)
               to 3B(140,290), then straight lines back to home.
               Circle through 1B/2B/3B: center≈(250,280) r≈110          */}
          <path
            d="M 360,290 A 110,110 0 1,0 140,290 L 250,400 Z"
            fill="url(#dirtGrad)"
          />

          {/* ── BASE PATH LINES (chalk on dirt edges of diamond) ── */}
          <line x1="250" y1="170" x2="360" y2="290"
            stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>
          <line x1="360" y1="290" x2="250" y2="400"
            stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>
          <line x1="250" y1="400" x2="140" y2="290"
            stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>
          <line x1="140" y1="290" x2="250" y2="170"
            stroke="rgba(255,255,255,0.45)" strokeWidth="3"/>

          {/* ── PITCHER'S MOUND ── */}
          <ellipse cx="250" cy="258" rx="22" ry="17"
            fill="#7A5030" stroke="#5A3820" strokeWidth="2"/>
          {/* Rubber */}
          <rect x="241" y="254" width="18" height="5" rx="1.5"
            fill="#F8F4E8" stroke="#ddd" strokeWidth="0.5"/>

          {/* ── BASES ──
               Each is a 24×24 square rotated 45° around its centre     */}
          {/* 2nd base — centre (250,170) */}
          <rect x="238" y="158" width="24" height="24" rx="2"
            fill="white" stroke="#ccc" strokeWidth="1.5"
            transform="rotate(45,250,170)"/>
          {/* 1st base — centre (360,290) */}
          <rect x="348" y="278" width="24" height="24" rx="2"
            fill="white" stroke="#ccc" strokeWidth="1.5"
            transform="rotate(45,360,290)"/>
          {/* 3rd base — centre (140,290) */}
          <rect x="128" y="278" width="24" height="24" rx="2"
            fill="white" stroke="#ccc" strokeWidth="1.5"
            transform="rotate(45,140,290)"/>
          {/* Home plate — proper pentagon */}
          <polygon
            points="237,392 263,392 263,408 250,418 237,408"
            fill="white" stroke="#ccc" strokeWidth="1.5"/>

          {/* Batter's boxes (subtle chalk rectangles) */}
          <rect x="218" y="390" width="16" height="24"
            fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
          <rect x="266" y="390" width="16" height="24"
            fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>

          {/* ── POSITION MARKERS ── */}
          {POSITIONS.map(p => {
            const isSelected = selected === p.id
            return (
              <g key={p.id} onClick={() => handlePositionClick(p.id)}
                style={{ cursor: 'pointer' }}>
                {/* Pulse ring */}
                {!isSelected && (
                  <circle cx={p.cx} cy={p.cy} r="26"
                    fill="rgba(46,94,168,0.15)"
                    stroke="rgba(46,94,168,0.3)" strokeWidth="1"
                    className="animate-pulse-soft"/>
                )}
                {/* Selected glow */}
                {isSelected && (
                  <circle cx={p.cx} cy={p.cy} r="30"
                    fill="rgba(245,200,66,0.15)"
                    stroke="rgba(245,200,66,0.5)" strokeWidth="2"/>
                )}
                <circle cx={p.cx} cy={p.cy} r="22"
                  fill={isSelected ? '#F5C842' : '#0F1E3A'}
                  stroke={isSelected ? '#C9A227' : '#2E5EA8'}
                  strokeWidth="2.5"
                  style={{ transition: 'fill 0.15s, stroke 0.15s' }}/>
                <text x={p.cx} y={p.cy - 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isSelected ? '#0F1E3A' : '#F8F4E8'}
                  fontSize="13" fontWeight="bold" fontFamily="system-ui">
                  {p.id}
                </text>
                <text x={p.cx} y={p.cy + 12}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isSelected ? '#5a3800' : '#93c5fd'}
                  fontSize="9" fontWeight="600" fontFamily="system-ui">
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
              <div className="text-sm font-semibold" style={{ color: '#93c5fd' }}>
                #{pos.number} · {pos.abbr || pos.id}
              </div>
            </div>
            <button
              onClick={() => { setSelected(null); playSound('tap') }}
              className="text-gray-400 text-xl leading-none hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
            >✕</button>
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
          <p className="text-sm" style={{ color: '#64748b' }}>
            Tap any position on the diamond to learn about that player!
          </p>
        </div>
      )}
    </div>
  )
}
