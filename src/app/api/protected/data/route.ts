import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  const user = await requireUser()
  if ('error' in user) return user.error

  let pings: number | null = null
  try {
    const db = await getDb()
    if (db) {
      const audit = db.collection('audit')
      await audit.insertOne({ userId: user.userId, action: 'ping', at: new Date() })
      pings = await audit.countDocuments({ userId: user.userId, action: 'ping' })
    }
  } catch (e) {
    console.error('MongoDB error', e)
  }

  return NextResponse.json({ userId: user.userId, role: user.role, isAdmin: user.isAdmin, pings })
}
