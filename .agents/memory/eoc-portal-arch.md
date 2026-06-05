---
name: EOC NGO Enrollment Portal architecture
description: Key decisions and conventions for Elizabeth Okwori's Confectionery enrollment portal.
---

## Stack
- pnpm monorepo: Express 5 API (`artifacts/api-server`), React+Vite portal (`artifacts/portal`), Drizzle+PG (`lib/db`), Orval-generated hooks (`lib/api-client-react`).
- Auth: Clerk (cookie-based, no Bearer tokens). `clerkProxyMiddleware` at `CLERK_PROXY_PATH`. Route `requireAuth` sets `req.clerkUserId`.
- Officer registration code: `EOC135` (hardcoded in `artifacts/api-server/src/routes/users.ts`).

## Role routing
`GET /api/users/me` auto-creates DB user from Clerk session claims. Client redirects:
- No role → `/complete-registration`
- participant → `/dashboard`
- officer → `/officer`

## Generated hooks (Orval)
- Queries with `enabled` also need an explicit `queryKey`: pass `queryKey: get<X>QueryKey(params)`.
- Mutations take `{id: number}` for confirm/reject/abort/markRead; `{data: {...}}` for create/update.

## DB seeding
- 14 skills by category, 3 packages, portal settings all seeded via direct SQL (settings PUT endpoint requires auth, easier to seed directly).

## Branding
Deep Emerald Green #0F5132, Gold #D4AF37, Cream #FFF8E7, Playfair Display + Poppins.
