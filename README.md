# ConditionLog

> AI-powered rental property condition documentation that protects your deposit.

## Overview

ConditionLog helps renters create structured, timestamped evidence of property conditions at move-in, move-out, and during tenancy. AI-powered damage detection and comparison reports make deposit disputes a thing of the past.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router, Server Components, Server Actions)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth & Database:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** OpenAI GPT-4o Vision API (Phase 2+)
- **PDF Generation:** React-PDF
- **Email:** Resend
- **Payments:** Stripe (Phase 5)
- **Deployment:** Vercel (web) + Supabase (backend)

## Monorepo Structure

```
apps/web        → Next.js web application
packages/shared → Shared TypeScript types, Zod schemas, constants
supabase/       → Database migrations and config
prompts/        → AI prompt files (Phase 2+)
docs/           → Architecture notes and reference material
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev --filter web

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values. See `.env.example` for documentation.

## Contributing

See [PLAN.md](PLAN.md) for the task breakdown. Work one task at a time. Each task gets its own feature branch named `feat/task-{number}-{slug}`.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) format.
