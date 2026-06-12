# Elizabeth Onyaole Okwori Memorial Foundation — NGO Enrollment Portal

A full-stack NGO enrollment portal for the **Elizabeth Onyaole Okwori Memorial Foundation (EEOMF)** — a Nigerian NGO providing FREE catering skills training to the less privileged and youth of Nigeria.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/portal run dev` — run the portal (port 25265)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 (port 8080, serves at `/api`)
- DB: PostgreSQL + Drizzle ORM
- Frontend: React + Vite + Wouter routing + TanStack Query + shadcn/ui + Clerk auth
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — DB schema (source of truth)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/portal/src/pages/` — React pages
- `artifacts/portal/src/components/layout/` — Layout components (PublicLayout, ParticipantLayout, OfficerLayout, Navbar)

## Architecture decisions

- Training is **100% free** — enrollment requires only `skillIds[]` (no packageId, no payment step). Status is immediately set to `confirmed`.
- All public-facing pages (About, Programs, Contact, Sponsorship, FAQ, Gallery, Blog) use `PublicLayout` (sticky nav + footer). Authenticated participant pages use `ParticipantLayout`. Officer pages use `OfficerLayout`.
- Sponsorship and beneficiary requests are unauthenticated POST endpoints (`/api/sponsorships`, `/api/beneficiary`) — anyone can submit. Officers get notified.
- Clerk auth with cookie-based sessions. Officer registration code: `EOC135` (hardcoded in `users.ts`).
- New DB tables: `sponsorships`, `beneficiary_requests` (in addition to the original tables).

## Product

- **Public visitors**: Browse home, about, programs, gallery, blog, FAQ, contact. Apply for sponsorship. Submit beneficiary fund requests.
- **Participants**: Register free → select skills → application confirmed immediately. View dashboard, notifications, announcements.
- **NGO Officers**: View all participants, manage skills/packages, send notifications, manage announcements, review beneficiary requests and sponsorship applications.

## Branding

- Name: ELIZABETH ONYAOLE OKWORI MEMORIAL FOUNDATION (abbrev: EEOMF)
- Primary: Deep Emerald Green `#0F5132`
- Secondary/Gold: `#D4AF37`
- Accent: Cream `#FFF8E7`
- Fonts: Playfair Display (serif) + Poppins (sans)

## Contact Details

- Address: No. 25, David Stone Street, Otukpo, Nigeria
- Phones: 0803 451 4674 | 0913 209 4696 | 0810 393 8592
- WhatsApp: 0812 299 0636 → `https://wa.me/2348122990636`
- Email: odehonyema97@gmail.com | odehpaul629@gmail.com

## User preferences

- Foundation name in full: Elizabeth Onyaole Okwori Memorial Foundation
- All training programs must be shown as FREE — no pricing or packages shown to users
- Officer registration code: EOC135

## Gotchas

- After any `lib/db` schema change: run `pnpm --filter @workspace/db run push`, then `pnpm run typecheck:libs`
- After any `lib/api-spec/openapi.yaml` change: run `pnpm --filter @workspace/api-spec run codegen`
- Do not run `pnpm dev` at workspace root — use `restart_workflow` instead
- `emailAddress` column in users table is nullable — handle `?? ""` when filtering by email

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
