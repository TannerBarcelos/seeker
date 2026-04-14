# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains **Seeker** — a podcast app with multi-queue listening.

## Apps

- `artifacts/queuecast` — **Seeker** mobile app (Expo / React Native)
- `artifacts/api-server` — Express API server
- `artifacts/mockup-sandbox` — Vite design sandbox

## Seeker App Architecture

**Key concept:** Multi-queue — users create named queues (e.g. "Tech", "True Crime") and add episodes to each independently, so different podcast categories never interfere with each other.

### State Management
- `context/QueuesContext.tsx` — queue CRUD + AsyncStorage persistence
- `context/PlayerContext.tsx` — mock playback state (progress timer)

### Screens
- `app/(tabs)/index.tsx` — Discover (featured shows + trending episodes)
- `app/(tabs)/queues.tsx` — Queues manager (create, rename, delete, expand)
- `app/(tabs)/library.tsx` — Library (subscribed shows + stats)
- `app/(tabs)/search.tsx` — Search (shows + episodes full-text)
- `app/player.tsx` — Full-screen player modal

### Data
- `constants/mockData.ts` — 8 podcasts, 16 episodes, typed interfaces
- `constants/colors.ts` — Deep navy dark theme (#0D1117 bg, #58A6FF primary)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
