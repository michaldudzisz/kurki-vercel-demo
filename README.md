# Kurki Vercel Demo

Next.js 16 + Clerk + MongoDB + Vercel AI SDK / OpenRouter, deployed serverless on Vercel.
See [AGENTS.md](AGENTS.md) for architecture.

## Run locally

1. `npm install`
2. `cp .env.example .env.local` and fill in the Clerk and OpenRouter keys
3. `docker compose up -d` or `podman compose up -d`: starts MongoDB on `localhost:27017`
4. `npm run dev`: http://localhost:3000

MongoDB is optional. Without `MONGODB_URI` the app still works, it just doesn't persist pings or chats.

### npm registry
`.npmrc` forces the public npm registry so corporate Artifactory settings don't apply.
If npm 11 refuses a freshly published package because of `min-release-age`, run
`npm install --min-release-age=0` or pin a slightly older patch version.

## Clerk roles (optional)
1. Clerk Dashboard → **Sessions → Customize session token**: `{"metadata": "{{user.public_metadata}}"}`
2. Set a user's public metadata to `{"role": "ADMIN"}` to unlock `/api/protected/admin`.

## Deploy to Vercel

1. Push the repo to GitHub, then in Vercel go to **Add New → Project** and import it. The framework is detected as Next.js.
2. **MongoDB Atlas:** Project → **Storage / Marketplace → MongoDB Atlas → Connect**. This creates a cluster and adds `MONGODB_URI` to the project.
   (Or set `MONGODB_URI` by hand, e.g. `mongodb+srv://…/kurki_vercel_demo`, and allow access from `0.0.0.0/0` in Atlas.)
3. **Settings → Environment Variables**: add every variable from `.env.example` (Clerk keys, `NEXT_PUBLIC_CLERK_*` URLs,
   `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`).
4. Deploy, or redeploy after changing env vars. CLI alternative: `npx vercel` and `npx vercel --prod`.
5. When you use a Clerk production instance, add the Vercel domain in the Clerk Dashboard.
