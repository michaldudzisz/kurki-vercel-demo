'use client'

import { useEffect, useState } from 'react'

type Hello = { message: string; timestamp: string }

export default function PublicStatus() {
  const [data, setData] = useState<Hello | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/public/hello')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true))
  }, [])

  const dot = error ? 'bg-red-500' : data ? 'bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400' : 'animate-pulse bg-slate-500'

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
      <span className="text-slate-300">{error ? 'API unavailable' : data ? data.message : 'Checking API…'}</span>
      {data && <span className="text-slate-500">{new Date(data.timestamp).toLocaleTimeString()}</span>}
    </div>
  )
}
