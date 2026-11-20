'use client'

import { useState } from 'react'

const endpoints = ['/api/protected/data', '/api/protected/admin']

export default function ApiTester() {
  const [result, setResult] = useState<{ path: string; status: number; body: unknown } | null>(null)
  const [loading, setLoading] = useState(false)

  const call = async (path: string) => {
    setLoading(true)
    try {
      const res = await fetch(path)
      const text = await res.text()
      let body: unknown = text
      try {
        body = JSON.parse(text)
      } catch {}
      setResult({ path, status: res.status, body })
    } catch (e) {
      setResult({ path, status: 0, body: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card space-y-4">
      <h2 className="text-lg font-semibold">API test</h2>
      <div className="flex flex-wrap gap-2">
        {endpoints.map((p) => (
          <button key={p} className="btn-ghost font-mono" disabled={loading} onClick={() => call(p)}>
            GET {p}
          </button>
        ))}
      </div>
      {result && (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="flex justify-between bg-white/5 px-3 py-1.5 font-mono text-xs">
            <span className="text-slate-400">{result.path}</span>
            <span className={result.status > 0 && result.status < 300 ? 'text-emerald-400' : 'text-red-400'}>{result.status}</span>
          </div>
          <pre className="overflow-x-auto bg-black/30 p-3 text-xs text-slate-200">{JSON.stringify(result.body, null, 2)}</pre>
        </div>
      )}
    </section>
  )
}
