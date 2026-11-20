import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { roleFromClaims } from '@/lib/auth'
import ApiTester from './ApiTester'
import Chat from './Chat'

export default async function Dashboard() {
  const { sessionClaims } = await auth.protect()
  const user = await currentUser()
  const role = roleFromClaims(sessionClaims)
  const email = user?.primaryEmailAddress?.emailAddress

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Kurki <span className="text-indigo-400">Vercel</span>
        </Link>
        <UserButton />
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <section className="card flex items-center gap-4">
            {user?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt="" className="h-14 w-14 rounded-full ring-2 ring-indigo-400/50" />
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold">{user?.fullName || email || user?.id}</p>
              <p className="truncate text-sm text-slate-400">{email}</p>
              <span
                className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${role === 'ADMIN' ? 'bg-amber-400/15 text-amber-300' : 'bg-emerald-400/15 text-emerald-300'}`}
              >
                {role}
              </span>
            </div>
          </section>
          <ApiTester />
        </div>
        <Chat />
      </div>
    </div>
  )
}
