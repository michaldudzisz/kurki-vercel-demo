import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireUser } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export const maxDuration = 60

const bodySchema = z.union([
  z.object({ messages: z.array(z.any()).min(1) }),
  z.object({ prompt: z.string().min(1) }),
])

export async function POST(req: Request) {
  const user = await requireUser()
  if ('error' in user) return user.error

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured' }, { status: 503 })

  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Expected { messages } or { prompt }' }, { status: 400 })

  const messages: UIMessage[] =
    'prompt' in parsed.data
      ? [{ id: crypto.randomUUID(), role: 'user', parts: [{ type: 'text', text: parsed.data.prompt }] }]
      : (parsed.data.messages as UIMessage[])

  const modelId = process.env.OPENROUTER_MODEL || 'openrouter/free'
  const openrouter = createOpenRouter({ apiKey })

  const result = streamText({
    model: openrouter(modelId),
    system: 'You are a helpful assistant. Answer concisely.',
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: all }) => {
      try {
        const db = await getDb()
        await db?.collection('chats').insertOne({ userId: user.userId, model: modelId, messages: all, at: new Date() })
      } catch (e) {
        console.error('MongoDB error', e)
      }
    },
  })
}
