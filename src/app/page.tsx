import Link from 'next/link'
import { Show, SignIn } from '@clerk/nextjs'
import PublicStatus from './PublicStatus'

export default function Home() {
  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
      <section className="space-y-6">
        <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
          Next.js · Clerk · MongoDB · OpenRouter
        </span>
        <h1 className="text-5xl font-bold tracking-tight">
          Kurki{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Vercel</span> Demo
        </h1>
        <p className="max-w-md text-lg text-slate-400">
          Serverless full-stack skeleton: auth, protected API routes, MongoDB persistence and a streaming AI chat.
        </p>
        <div className="card inline-block py-3!">
          <PublicStatus />
        </div>
      </section>

      <section className="flex justify-center">
        <Show when="signed-out">
          <SignIn routing="hash" forceRedirectUrl="/dashboard" />
        </Show>
        <Show when="signed-in">
          <div className="card space-y-4 text-center">
            <p className="text-slate-300">You are signed in.</p>
            <Link href="/dashboard" className="btn">
              Go to dashboard →
            </Link>
          </div>
        </Show>
      </section>
    </main>
  )
}
