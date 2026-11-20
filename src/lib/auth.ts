import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

type Claims = { metadata?: { role?: string } } | null | undefined

/** Role from the `metadata.role` session claim (Clerk session token: {"metadata": "{{user.public_metadata}}"}). */
export function roleFromClaims(claims: unknown): string {
  return ((claims as Claims)?.metadata?.role ?? 'USER').toUpperCase()
}

/** Returns the current user or a 401 response. */
export async function requireUser() {
  const { userId, sessionClaims } = await auth()
  if (!userId) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) } as const
  const role = roleFromClaims(sessionClaims)
  return { userId, role, isAdmin: role === 'ADMIN' } as const
}
