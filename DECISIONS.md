# DECISIONS.md — ConditionLog

> Record of architectural and design decisions. Format: Question → Decision → Date.

---

### D-001: Mobile approach
- **Question:** Build mobile (Expo/React Native) from Phase 0, or go web-first?
- **Decision:** Web-first. Mobile deferred to a future phase. Next.js web app works on phone browsers. Expo scaffold deferred entirely.
- **Date:** 2026-02-24

### D-002: PDF engine
- **Question:** React-PDF, Puppeteer, or third-party API for PDF generation?
- **Decision:** React-PDF (`@react-pdf/renderer`). Serverless-friendly, works on Vercel, no Chromium dependency.
- **Date:** 2026-02-24

### D-003: Backend architecture
- **Question:** Next.js Server Actions, Supabase Edge Functions, or hybrid?
- **Decision:** Next.js Server Actions + Route Handlers. All server logic co-located with the web app. Simpler deployment, Vercel-native.
- **Date:** 2026-02-24

### D-004: Photo annotation
- **Question:** Include drag-to-highlight annotation in Phase 1?
- **Decision:** Deferred to Phase 2 or later. Phase 1 focuses on core capture/document/export loop.
- **Date:** 2026-02-24

### D-005: Package manager
- **Question:** npm, yarn, or pnpm?
- **Decision:** pnpm (Turborepo standard).
- **Date:** 2026-02-25

### D-006: Supabase local dev
- **Question:** Supabase CLI with Docker for local dev, or cloud from the start?
- **Decision:** Supabase cloud from the start. Skip Docker. Can migrate to local dev later if needed.
- **Date:** 2026-02-25

### D-007: Apple Sign-In
- **Question:** Include Apple Sign-In in Phase 1?
- **Decision:** Skip. Add when building the iOS app (Phase 6+). Phase 1 auth: email/password + Google OAuth only.
- **Date:** 2026-02-25

### D-008: Share link behavior
- **Question:** Signed PDF download URL or a full rendered web page?
- **Decision:** Full rendered web page (public, no auth required). The landlord receiving a professional URL is the point.
- **Date:** 2026-02-25

### D-009: Email delivery in Phase 1
- **Question:** Set up Resend in Phase 1 or defer?
- **Decision:** Set up Resend in Phase 1. Email delivery is core value prop ("email yourself proof").
- **Date:** 2026-02-25

### D-010: Property type field
- **Question:** Add `property_type` enum to drive room templates?
- **Decision:** Yes. Enum: `apartment`, `house`, `condo`, `studio`, `townhouse`, `other`. Drives smart room template defaults.
- **Date:** 2026-02-25

### D-011: Room photo checklist
- **Question:** Static UI hints or tracked checklist?
- **Decision:** Static UI hints only (text guidance per room type). Tracked checklist deferred — don't over-engineer before we have users.
- **Date:** 2026-02-25

### D-012: Free tier watermark
- **Question:** Implement PDF watermarking in Phase 1?
- **Decision:** Defer to Phase 5 with paywall logic. All Phase 1 PDFs are unwatermarked.
- **Date:** 2026-02-25

### D-013: Camera vs file upload on web
- **Question:** Camera-only or both camera + file upload?
- **Decision:** Both. Camera capture includes verified timestamps. File uploads use file metadata with a warning: "Photos captured in-app include verified timestamps. Uploaded files will use file metadata if available."
- **Date:** 2026-02-25

### D-014: Profiles table
- **Question:** Separate `users` table or `profiles` referencing `auth.users`?
- **Decision:** `public.profiles` referencing `auth.users(id)`, populated via a database trigger on sign-up.
- **Date:** 2026-02-25

### D-015: updated_at columns
- **Question:** Add `updated_at` with auto-update triggers?
- **Decision:** Yes, on all tables from the start.
- **Date:** 2026-02-25

### D-016: Stripe fields early
- **Question:** Add `stripe_customer_id` now or later?
- **Decision:** Add `stripe_customer_id TEXT` to `profiles` now to avoid a migration later.
- **Date:** 2026-02-25

### D-017: Soft deletes
- **Question:** Soft delete or hard delete?
- **Decision:** Soft delete (`deleted_at TIMESTAMPTZ NULL`) on `properties` and `reports` only. Rooms and photos are hard-deleted (always children of a report). All queries must filter `WHERE deleted_at IS NULL`.
- **Date:** 2026-02-25

### D-018: Storage paths in DB
- **Question:** Store full Supabase URLs or bucket-relative paths?
- **Decision:** Bucket-relative paths only. Never store full URLs — more portable if we change storage providers.
- **Date:** 2026-02-25

### D-019: docs/ folder
- **Question:** Where to put architecture notes and non-prompt reference material?
- **Decision:** `docs/` folder at repo root.
- **Date:** 2026-02-25
