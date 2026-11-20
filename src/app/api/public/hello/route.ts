import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ message: 'Hello from Vercel Next.js API', timestamp: new Date().toISOString() })
}
