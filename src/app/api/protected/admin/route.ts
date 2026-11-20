import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'

export async function GET() {
  const user = await requireUser()
  if ('error' in user) return user.error
  if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden: ADMIN role required' }, { status: 403 })
  return NextResponse.json({ message: 'Welcome, admin!', userId: user.userId })
}
