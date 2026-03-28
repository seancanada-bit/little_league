import { PlayCircle, HelpCircle, Target, BarChart2 } from 'lucide-react'
import { playSound } from '../utils/sounds'

// Field tab keeps a custom SVG — no library has a proper baseball diamond icon
function FieldIcon({ active }) {
  const c = active ? '#F5C842' : '#94a3b8'
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      {/* Diamond outline */}
      <path d="M12 3L21 12L12 21L3 12Z"
        stroke={c} strokeWidth="1.8" strokeLinejoin="round"
        fill={active ? 'rgba(245,200,66,0.12)' : 'none'}/>
      {/* Infield arc */}
      <path d="M8.5 15.5 A5 5 0 0 1 15.5 15.5"
        stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Bases */}
      <circle cx="12" cy="6.5" r="1.1" fill={c}/>
      <circle cx="17.5" cy="12" r="1.1" fill={c}/>
      <circle cx="6.5"  cy="12" r="1.1" fill={c}/>
      {/* Home plate */}
      <path d="M10.8 17.5 H13.2 L13.2 19 L12 20 L10.8 19 Z" fill={c}/>
    </svg>
  )
}

const tabs = [
  { id: 'diamond', label: 'Field',  Icon: null,       CustomIcon: FieldIcon },
  { id: 'plays',   label: 'Plays',  Icon: PlayCircle, CustomIcon: null },
  { id: 'quiz',    label: 'Quiz',   Icon: HelpCircle, CustomIcon: null },
  { id: 'throw',   label: 'Throw!', Icon: Target,     CustomIcon: null },
  { id: 'stats',   label: 'Stats',  Icon: BarChart2,  CustomIcon: null },
]

function TabIcon({ tab, active }) {
  const color = active ? '#F5C842' : '#94a3b8'
  if (tab.CustomIcon) return <tab.CustomIcon active={active} />
  return <tab.Icon size={24} color={color} strokeWidth={active ? 2.2 : 1.8} />
}

export default function NavBar({ active, onChange }) {
  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'linear-gradient(0deg, #0a1628 0%, rgba(10,22,40,0.95) 100%)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(245,200,66,0.15)'
        }}>
        <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
          {tabs.map(tab => {
            const isActive = active === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { playSound('tap'); onChange(tab.id) }}
                className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-150"
                style={{ transform: isActive ? 'translateY(-2px)' : 'none' }}
              >
                <TabIcon tab={tab} active={isActive} />
                <span className="text-xs font-semibold tracking-wide"
                  style={{ color: isActive ? '#F5C842' : '#64748b', fontFamily: 'Inter, sans-serif' }}>
                  {tab.label}
                </span>
                {isActive && <div className="w-1 h-1 rounded-full bg-yellow-400 mt-0.5" />}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-48 z-40 py-6 px-3 gap-2"
        style={{
          background: 'rgba(10,22,40,0.95)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(245,200,66,0.1)'
        }}>
        <div className="text-center mb-6 px-2">
          <div className="font-display text-2xl text-yellow-400 leading-tight">COACH</div>
          <div className="font-display text-2xl text-white leading-tight">YOGI</div>
        </div>
        {tabs.map(tab => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => { playSound('tap'); onChange(tab.id) }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left"
              style={{
                background: isActive ? 'rgba(245,200,66,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(245,200,66,0.3)' : '1px solid transparent',
                transform: isActive ? 'translateX(4px)' : 'none'
              }}
            >
              <TabIcon tab={tab} active={isActive} />
              <span className="font-semibold text-sm"
                style={{ color: isActive ? '#F5C842' : '#94a3b8' }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
