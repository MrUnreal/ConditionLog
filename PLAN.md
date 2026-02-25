# PLAN.md — ConditionLog

> AI-powered rental property condition documentation app.
> Planning covers Phase 0 and Phase 1 only. Subsequent phases planned as we approach them.

---

## Phase 0: Foundation & Setup

### Task 0.1 — Initialize monorepo with Turborepo + pnpm ✅
- **Depends on:** —
- **Files:** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, `.nvmrc`, `README.md`
- **Done when:** `pnpm install` succeeds; `turbo build` pipeline configured for build/lint/typecheck
- **Completed:** Monorepo initialized with Turborepo 2.8, pnpm 10, Prettier, directory scaffolding, PLAN.md, DECISIONS.md, and README.

### Task 0.2 — Scaffold Next.js 14+ app (App Router)
- **Depends on:** 0.1
- **Files:** `apps/web/**` (initial scaffold)
- **Done when:** `pnpm dev --filter web` starts Next.js on localhost:3000 with a placeholder page

### Task 0.3 — Configure TypeScript strict mode + ESLint + Prettier
- **Depends on:** 0.2
- **Files:** `tsconfig.json` (root + apps/web), `.eslintrc.*`, `.prettierrc`, `apps/web/tsconfig.json`
- **Done when:** `turbo lint` and `turbo typecheck` pass with zero errors; strict mode enabled in all tsconfigs

### Task 0.4 — Create shared package (`@conditionlog/shared`)
- **Depends on:** 0.3
- **Files:** `packages/shared/**`
- **Done when:** `apps/web` can `import { ... } from '@conditionlog/shared'`; Zod schemas for all core entities compile; types are inferred and exported

### Task 0.5 — Set up Tailwind CSS + shadcn/ui
- **Depends on:** 0.2
- **Files:** `apps/web/tailwind.config.ts`, `apps/web/app/globals.css`, `apps/web/components/ui/*`, `apps/web/lib/utils.ts`
- **Done when:** shadcn/ui Button + Card + Input components render correctly in the browser

### Task 0.6 — Configure Supabase project (cloud)
- **Depends on:** 0.1
- **Files:** `supabase/config.toml`, `.env.example`, `.env.local`
- **Done when:** Supabase cloud project created; `.env.example` documents `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`

### Task 0.7 — Initial database migration (core tables + RLS policies)
- **Depends on:** 0.4, 0.6
- **Files:** `supabase/migrations/00001_initial_schema.sql`, `supabase/seed.sql`
- **Done when:** Tables `profiles`, `properties`, `reports`, `rooms`, `photos`, `comparisons` created with RLS policies; `profiles` populated via trigger on `auth.users` insert; `updated_at` auto-update triggers on all tables; soft-delete (`deleted_at`) on `properties` and `reports`; migration applies cleanly via `supabase db push`; seed data inserts without errors

### Task 0.8 — Set up GitHub Actions CI
- **Depends on:** 0.3
- **Files:** `.github/workflows/ci.yml`
- **Done when:** CI runs lint + typecheck on push to any branch; green on main

### Task 0.9 — Deploy apps/web to Vercel
- **Depends on:** 0.2, 0.8
- **Files:** Vercel project config, `apps/web/next.config.mjs` (if changes needed)
- **Done when:** Main branch auto-deploys; PR branches get preview URLs; env vars configured

---

## Phase 1: MVP Core — Guided Walkthrough + PDF Report

### Task 1.1 — Supabase Auth integration (client + server + middleware)
- **Depends on:** 0.7, 0.5
- **Files:** `apps/web/lib/supabase/client.ts`, `apps/web/lib/supabase/server.ts`, `apps/web/lib/supabase/middleware.ts`, `apps/web/middleware.ts`
- **Done when:** Supabase auth session flows through SSR; protected routes redirect unauthenticated users to login; session refreshes automatically

### Task 1.2 — Auth UI (login, register, logout, Google OAuth)
- **Depends on:** 1.1
- **Files:** `apps/web/app/(auth)/login/page.tsx`, `apps/web/app/(auth)/register/page.tsx`, `apps/web/app/(auth)/layout.tsx`, `apps/web/components/auth/*`, `apps/web/actions/auth.ts`
- **Done when:** User can register with email/password, sign in, sign out; Google OAuth flow works end-to-end; form validation with Zod; `profiles` row auto-created on first sign-in via DB trigger

### Task 1.3 — Create property form + server action
- **Depends on:** 1.2
- **Files:** `apps/web/app/(dashboard)/properties/new/page.tsx`, `apps/web/actions/properties.ts`, `apps/web/components/properties/*`, `packages/shared/src/schemas/property.ts`
- **Done when:** User can create a property (address, unit, landlord info, lease dates, deposit amount, `property_type` enum); data validates via Zod; persists to `properties` table; redirects to dashboard on success

### Task 1.4 — Dashboard (list properties + reports)
- **Depends on:** 1.3
- **Files:** `apps/web/app/(dashboard)/page.tsx`, `apps/web/app/(dashboard)/properties/[id]/page.tsx`, `apps/web/components/properties/*`, `apps/web/components/reports/*`
- **Done when:** Dashboard lists all user properties (filtered `WHERE deleted_at IS NULL`) with key info; property detail page shows associated reports; empty states for no properties / no reports

### Task 1.5 — New Report flow (create move-in / move-out / maintenance report)
- **Depends on:** 1.4
- **Files:** `apps/web/app/(dashboard)/reports/new/page.tsx`, `apps/web/actions/reports.ts`, `packages/shared/src/schemas/report.ts`
- **Done when:** User selects a property, chooses report type (move_in / move_out / maintenance), report created in `draft` status; redirects to room setup

### Task 1.6 — Room management (add, remove, reorder from templates)
- **Depends on:** 1.5
- **Files:** `apps/web/app/(dashboard)/reports/[id]/rooms/page.tsx`, `apps/web/actions/rooms.ts`, `apps/web/components/rooms/*`, `packages/shared/src/schemas/room.ts`, `packages/shared/src/constants/rooms.ts`
- **Done when:** User can add rooms from template list driven by `property_type` (e.g. apartments suggest Kitchen, Bathroom, Bedroom, Living Room, Entry, Closet; houses add Garage, Patio, Laundry, etc.); rename labels; reorder via drag; remove rooms; data persists to `rooms` table

### Task 1.7 — Photo capture + upload to Supabase Storage
- **Depends on:** 1.6
- **Files:** `apps/web/components/photos/photo-capture.tsx`, `apps/web/actions/photos.ts`, `packages/shared/src/schemas/photo.ts`
- **Done when:** User can capture photos via MediaDevices API (camera) or upload files per room; camera-captured photos include verified timestamps + geolocation; uploaded files use file metadata with a warning ("Uploaded files will use file metadata if available — photos captured in-app include verified timestamps"); images compressed client-side before upload; uploaded to Supabase Storage (bucket-relative paths stored in DB) with progress indicator; `photos` row created

### Task 1.8 — Photo management UI (gallery, captions, notes, delete)
- **Depends on:** 1.7
- **Files:** `apps/web/components/photos/photo-gallery.tsx`, `apps/web/components/photos/photo-detail.tsx`
- **Done when:** Per-room photo grid with thumbnails; click to enlarge; inline caption + notes editing; reorder and delete photos (hard delete); changes persist

### Task 1.9 — Room notes + guided walkthrough UI
- **Depends on:** 1.6, 1.7
- **Files:** `apps/web/app/(dashboard)/reports/[id]/walkthrough/page.tsx`, `apps/web/components/rooms/walkthrough.tsx`, `apps/web/components/rooms/room-checklist.tsx`
- **Done when:** Step-by-step room-by-room interface; progress bar ("3 of 8 rooms documented"); static suggested photo checklist per room type (walls, ceiling, floor, fixtures, appliances, windows, outlets — text hints only, not tracked); general notes field per room; can navigate forward/back between rooms

### Task 1.10 — Report summary + complete action
- **Depends on:** 1.9
- **Files:** `apps/web/app/(dashboard)/reports/[id]/review/page.tsx`, `apps/web/components/reports/report-summary.tsx`, `apps/web/actions/reports.ts`
- **Done when:** Summary page shows all rooms with photo counts + notes; "Complete Report" button locks the report, sets `completed_at` timestamp, changes status to `completed`; completed reports are read-only

### Task 1.11 — PDF generation with React-PDF
- **Depends on:** 1.10
- **Files:** `apps/web/lib/pdf/generate.tsx`, `apps/web/lib/pdf/templates/*`, `apps/web/app/api/reports/[id]/pdf/route.ts`
- **Done when:** API route generates PDF via `@react-pdf/renderer` with property header, room sections, all photos with captions/notes/timestamps, geolocation footer, page numbers; no watermark (deferred to Phase 5); PDF stored in Supabase Storage; `reports.pdf_url` updated with bucket-relative path

### Task 1.12 — PDF download + report export
- **Depends on:** 1.11
- **Files:** `apps/web/app/(dashboard)/reports/[id]/page.tsx`, `apps/web/components/reports/export-button.tsx`
- **Done when:** User can download the generated PDF from the report detail page; download triggers browser save dialog

### Task 1.13 — Email report via Resend
- **Depends on:** 1.11
- **Files:** `apps/web/app/api/reports/[id]/email/route.ts`, `apps/web/components/reports/email-dialog.tsx`, `apps/web/lib/email/*`, `.env.example` (add `RESEND_API_KEY`)
- **Done when:** User can email the PDF to themselves (or any email address); Resend configured; email includes a professional template with the report PDF attached; rate-limited to prevent abuse

### Task 1.14 — Shareable report link + public web view
- **Depends on:** 1.11
- **Files:** `apps/web/app/share/[id]/page.tsx`, `apps/web/actions/reports.ts`, `apps/web/components/reports/share-dialog.tsx`, `supabase/migrations/00002_share_tokens.sql`
- **Done when:** "Share" generates a secure token-based URL; public page renders the full report (photos, notes, timestamps, property info) as a professional web page without requiring auth; share link is copyable; looks good enough to send to a landlord

### Task 1.15 — Responsive design pass
- **Depends on:** 1.9, 1.10, 1.12, 1.14
- **Files:** Various component files across `apps/web/components/`
- **Done when:** All Phase 1 screens tested and usable at 375px viewport width; no horizontal scroll; touch-friendly tap targets; tested in Chrome DevTools mobile emulation
