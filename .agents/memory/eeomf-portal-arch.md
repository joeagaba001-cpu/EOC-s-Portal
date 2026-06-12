---
name: EEOMF portal architecture
description: Key architectural decisions for the Elizabeth Onyaole Okwori Memorial Foundation NGO enrollment portal.
---

# EEOMF Portal Architecture

## Free Enrollment
Training is 100% free. `packageId` in enrollments is nullable. POST `/api/enrollments` requires only `{ skillIds: number[] }`. Status immediately set to `"confirmed"` — no payment step.

**Why:** Foundation provides free vocational training to the less privileged; old paid package model was removed in v2 rebrand.

**How to apply:** When the Skills page submits enrollment, send `{ skillIds }` only. Never prompt for package selection or payment.

## Layout Types
- `PublicLayout` — sticky top navbar + full footer; used by all public pages (Home nav only, About, Programs, Contact, Sponsorship, FAQ, Gallery, Blog, BeneficiaryFund)
- `ParticipantLayout` — authenticated participant sidebar layout
- `OfficerLayout` — authenticated officer sidebar layout

**Why:** Public pages needed a consistent branded navigation without auth. Home.tsx builds its own inline nav since it has a hero overlay.

## New DB Tables (added in v2)
- `sponsorshipsTable` — unauthenticated sponsorship applications (POST `/api/sponsorships`)
- `beneficiaryRequestsTable` — fund disbursement requests (POST `/api/beneficiary`)
Both send officer notifications on creation.

## New Routes Added
- `/contact`, `/sponsorship`, `/beneficiary`, `/faq`, `/gallery`, `/blog` — all public, no auth
