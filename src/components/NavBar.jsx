import { playSound } from '../utils/sounds'

const tabs = [
  {
    id: 'diamond',
    label: 'Field',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2L22 12L12 22L2 12Z" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="2" fill={active ? 'rgba(245,200,66,0.15)' : 'none'} strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="2" fill={active ? '#F5C842' : '#94a3b8'}/>
      </svg>
    )
  },
  {
    id: 'plays',
    label: 'Plays',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="2"/>
        <path d="M10 8l6 4-6 4V8z" fill={active ? '#F5C842' : '#94a3b8'}/>
      </svg>
    )
  },
  {
    id: 'quiz',
    label: 'Quiz',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="2"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="17" r="1" fill={active ? '#F5C842' : '#94a3b8'}/>
      </svg>
    )
  },
  {
    id: 'throw',
    label: 'Throw!',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="5" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="2"/>
        <path d="M10.5 10.5 Q12 9 13.5 10.5" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="1.5" fill="none"/>
        <path d="M10.5 13.5 Q12 15 13.5 13.5" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="1.5" fill="none"/>
        <path d="M19 5l-3 3M5 19l3-3M19 19l-3-3M5 5l3 3" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'stats',
    label: 'Stats',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M18 20V10M12 20V4M6 20v-6" stroke={active ? '#F5C842' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  }
]

export default function NavBar({ active, onChange }) {
  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40" style={{background: 'linear-gradient(0deg, #0a1628 0%, rgba(10,22,40,0.95) 100%)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(245,200,66,0.15)'}}>
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
                {tab.icon(isActive)}
                <span className="text-xs font-semibold tracking-wide" style={{ color: isActive ? '#F5C842' : '#64748b', fontFamily: 'Inter, sans-serif' }}>
                  {tab.label}
                </span>
                {isActive && <div className="w-1 h-1 rounded-full bg-yellow-400 mt-0.5" />}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-48 z-40 py-6 px-3 gap-2" style={{background: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(12px)', borderRight: '1px solid rgba(245,200,66,0.1)'}}>
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
              {tab.icon(isActive)}
              <span className="font-semibold text-sm" style={{ color: isActive ? '#F5C842' : '#94a3b8' }}>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )
}
