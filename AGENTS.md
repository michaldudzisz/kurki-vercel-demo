# AGENTS.md – Architecture guidelines

Hackathon full-stack app: **Next.js 16 (App Router, TypeScript, Tailwind v4)** deployed serverless on **Vercel**.
Port of `../kurki-railway-demo` (Spring Boot + React) – same features, one JS project.

## Layout
```
src/
  proxy.ts                 Clerk clerkMiddleware() – route protection (Next 16 name for middleware.ts)
  lib/auth.ts              requireUser() → { userId, role, isAdmin } or 401 response; roleFromClaims()
  lib/mongodb.ts           getDb() – cached MongoClient (globalThis), null when MONGODB_URI unset
  app/layout.tsx           <ClerkProvider>
  app/page.tsx             public home: API status + <SignIn /> / link to dashboard
  app/dashboard/           protected page (server) + client components (ApiTester, Chat)
  app/api/public/**        no auth
  app/api/protected/**     Clerk session required (401); admin/* requires role ADMIN (403)
  app/api/ai/chat          streaming chat (AI SDK + OpenRouter), session required
```

## Rules
- **All backend code lives in Route Handlers under `src/app/api`.** Start every protected handler with
  `const user = await requireUser(); if ('error' in user) return user.error`.
  `proxy.ts` also blocks `/api/protected(.*)`, `/api/ai(.*)` (401) and `/dashboard(.*)` (redirect to sign-in).
- **Clerk (`@clerk/nextjs` v7):**
  - Use `<Show when="signed-in">` / `<Show when="signed-out">`. Do **not** use deprecated `<SignedIn>` / `<SignedOut>`.
  - Server: `await auth()` / `await auth.protect()` / `await currentUser()` from `@clerk/nextjs/server`.
  - Role comes from the `metadata.role` session claim (Clerk Dashboard → Sessions → Customize session token:
    `{"metadata": "{{user.public_metadata}}"}`), set per user via public metadata `{"role": "ADMIN"}`. Default `USER`.
  - Frontend `fetch('/api/...')` needs no token – Clerk session cookie is same-origin.
- **AI:** Vercel AI SDK (`ai` v7) `streamText` + `@openrouter/ai-sdk-provider`, returned with
  `result.toUIMessageStreamResponse()`. Client uses `useChat({ transport: new DefaultChatTransport({ api: '/api/ai/chat' }) })` from `@ai-sdk/react` (posts `{ messages }`).
  Route also accepts `{ prompt }`. Model: `OPENROUTER_MODEL` (default `openrouter/free`). Validate input with `zod`.
- **MongoDB:** native `mongodb` driver, always via `getDb()` (never create clients per request). DB name comes from the URI path.
  Mongo is optional – handle `null` and catch errors so the app works without it. Collections: `audit` (pings), `chats`.
- **Config:** env vars only (see `.env.example`); locally in `.env.local`. Never commit secrets.
- **Client vs server:** pages are Server Components by default; add `'use client'` only for interactive components.
- Keep it simple: hackathon code, favor speed and readability over abstraction.

## Commands
- `npm run dev` – http://localhost:3000
- `npm run build` – production build (also type-checks)
- `npm run typecheck`
- `docker compose up -d` / `podman compose up -d` – local MongoDB
