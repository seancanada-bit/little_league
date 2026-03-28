const tabs = [
  { id: 'diamond', label: 'Field',  icon: '🟫' },
  { id: 'plays',   label: 'Plays',  icon: '🎬' },
  { id: 'quiz',    label: 'Quiz',   icon: '🧠' },
  { id: 'throw',   label: 'Throw!', icon: '🎯' },
  { id: 'stats',   label: 'Stats',  icon: '📊' },
]

export default function NavBar({ tab, setTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-emerald-900 border-t border-emerald-700 flex">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
            tab === t.id
              ? 'text-yellow-300 bg-emerald-800'
              : 'text-emerald-300 hover:text-white'
          }`}
        >
          <span className="text-xl">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}
