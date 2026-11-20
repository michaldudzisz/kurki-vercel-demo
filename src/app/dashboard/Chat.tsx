'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useState } from 'react'

const transport = new DefaultChatTransport({ api: '/api/ai/chat' })

export default function Chat() {
  const { messages, sendMessage, status, stop, error, setMessages } = useChat({ transport })
  const [input, setInput] = useState('')
  const bottom = useRef<HTMLDivElement>(null)
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || busy) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <section className="card flex h-[70vh] flex-col p-0!">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold">AI chat</h2>
        {messages.length > 0 && !busy && (
          <button className="text-xs text-slate-400 hover:text-slate-200" onClick={() => setMessages([])}>
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
        {messages.length === 0 && <p className="mt-20 text-center text-slate-500">Ask something to get started ✨</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-indigo-500 text-white' : 'rounded-bl-sm bg-white/10 text-slate-100'}`}
            >
              {m.parts.map((p, i) => (p.type === 'text' ? <span key={i}>{p.text}</span> : null))}
            </div>
          </div>
        ))}
        {status === 'submitted' && (
          <div className="flex gap-1 px-2">
            {[0, 150, 300].map((d) => (
              <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        )}
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">Error: {error.message}</p>}
        <div ref={bottom} />
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-white/10 p-4">
        <input
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-indigo-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
        />
        {busy ? (
          <button type="button" className="btn-ghost" onClick={() => stop()}>
            Stop
          </button>
        ) : (
          <button type="submit" className="btn" disabled={!input.trim()}>
            Send
          </button>
        )}
      </form>
    </section>
  )
}
