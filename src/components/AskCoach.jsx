import { useState, useRef, useEffect } from 'react'

const API_BASE = '/sandbox/baseball-coach/api'

const SUGGESTIONS = [
  "What is a double play?",
  "How do you throw a curveball?",
  "What does ERA mean?",
  "Why do batters spit on their gloves?",
  "What's the hardest position to play?",
  "How fast do pro pitchers throw?",
]

export default function AskCoach() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there, slugger! 👋 I'm Coach Claude! I know everything about baseball and I love teaching kids just like you. Ask me anything — plays, rules, positions, pro players — whatever you're curious about! ⚾"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/coach.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: newMessages.slice(-6)
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || "Hmm, I had trouble thinking of an answer. Try asking again!"
      }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I couldn't connect right now. Make sure you're online and try again! ⚾"
      }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 130px)' }}>
      <div className="p-3 bg-emerald-800 border-b border-emerald-700">
        <h2 className="text-base font-bold text-yellow-300">💬 Ask the Coach</h2>
        <p className="text-xs text-emerald-300">Coach Claude knows everything about baseball!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">
                ⚾
              </div>
            )}
            <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-emerald-800 text-white rounded-tl-none border border-emerald-600'
            }`}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm mr-2 flex-shrink-0">
              ⚾
            </div>
            <div className="bg-emerald-800 border border-emerald-600 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-3 pb-2">
          <p className="text-xs text-emerald-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-emerald-800 hover:bg-emerald-700 text-emerald-200 px-3 py-1.5 rounded-full border border-emerald-600 active:scale-95 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border-t border-emerald-700 bg-emerald-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask Coach anything about baseball..."
            className="flex-1 bg-emerald-800 border border-emerald-600 rounded-xl px-3 py-2 text-sm text-white placeholder-emerald-500 focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-yellow-400 text-emerald-900 font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
