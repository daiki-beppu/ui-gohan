# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**ui-gohan** is a React Native mobile app for managing weekly meal plans (献立管理). Built with Expo and TypeScript, the app enables users to organize meals for Monday through Sunday with drag-and-drop functionality and offline-first architecture.

**Current Status**: Phase 2 (MVP Development) - Environment and authentication infrastructure complete, implementing core features.

**Tech Stack**:

- React Native 0.81.5 + Expo 54.0.0
- TypeScript
- Expo Router v6 (file-based routing)
- Better Auth v1.3.34 (authentication with guest login support)
- Turso Cloud (SQLite) + Drizzle ORM v0.44.7
- React Native Reusables (shadcn/ui-style components)
- NativeWind (Tailwind CSS for React Native)

---

## Architecture & Structure

### File-Based Routing (Expo Router)

```
app/
├── _layout.tsx              # Root layout with ThemeProvider and PortalHost
├── index.tsx                # Home screen
├── (auth)/                  # Auth layout group
│   ├── sign-in.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
└── api/auth/[...auth]+api.ts # Better Auth API endpoint
```

- Uses **layout groups** like `(auth)` to organize related screens without affecting URL structure
- Root layout provides theme context and portal host for modals/overlays
- API routes handle server-side logic (Better Auth endpoints)

### Key Directories

**`lib/`** - Core utilities and configuration

- `auth.ts` - Better Auth server configuration (Drizzle adapter, anonymous plugin)
- `auth-client.ts` - Better Auth client with Expo integration (secure token storage)
- `theme.ts` - NativeWind theme configuration and color system
- `utils.ts` - Helper functions (e.g., `cn()` for className merging)

**`db/`** - Database layer

- `index.ts` - Drizzle ORM client configured for Turso Cloud
- `schemas/` - Database schema definitions (currently commented out, ready for implementation)
- `migrations/` - Drizzle Kit migration files
- `local/` - Local SQLite replica files

**`components/ui/`** - 34+ React Native Reusables components

- Includes: button, text, input, card, avatar, dialog, dropdown-menu, etc.
- Styled with NativeWind and CVA (class-variance-authority)
- Follow shadcn/ui design patterns

**`const/`** - Application constants

- `day-of-week.ts` - Day constants with `as const` pattern

**`types/`** - TypeScript type definitions

- Shared types for data models (e.g., Menu interface)

---

## Authentication Setup (Better Auth)

### Server Configuration (`lib/auth.ts`)

- **Drizzle Adapter**: Auto-manages user, session, account, verification tables
- **Anonymous Plugin**: Enables guest login without email/password
- **Email/Password**: Standard authentication with password reset via Resend
- **Trusted Origins**: `ui-gohan://` for mobile deep linking

### Client Configuration (`lib/auth-client.ts`)

- **expoClient Plugin**: Handles mobile-specific auth flows
- **expo-secure-store**: Stores tokens securely on device
- **baseURL**: Points to `http://localhost:8081` (dev) or production URL
- **Exports**: `authClient`, `requestPasswordReset()`, `resetPassword()` functions

### API Route (`app/api/auth/[...auth]+api.ts`)

- Mounts Better Auth handlers for GET and POST requests
- Handles all auth operations: sign-in, sign-out, password reset, etc.

### Usage Pattern

```typescript
import { authClient } from '@/lib/auth-client';

// In components
const { data: session, isPending } = authClient.useSession();

// Sign out
await authClient.signOut();
```

---

## Database Setup (Turso + Drizzle)

### Connection (`db/index.ts`)

- Configured for Turso Cloud (libsql)
- Environment variables: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Schema location: `db/schemas/` (currently commented out)

### Planned Schema Structure

- **Better Auth tables** (auto-managed): user, session, account, verification
- **Menu table** (to be implemented):
  - Fields: id, userId, dayOfWeek, mealType, dishName, memo, sortOrder, timestamps
  - Indexes on userId and sortOrder for performance

### Migration Workflow

```bash
pnpm drizzle-kit generate  # Generate migration from schema changes
pnpm drizzle-kit push      # Apply migrations to Turso Cloud
```

---

## UI Components & Styling

### React Native Reusables

- Pre-built components following shadcn/ui design patterns
- Located in `components/ui/`
- Use CVA for variant management
- Fully typed with TypeScript

### NativeWind (Tailwind CSS)

- Configured in `tailwind.config.js`
- Global styles in `global.css` with CSS custom properties
- Dark mode support via `useColorScheme()` hook
- Theme colors defined in `lib/theme.ts` with NAV_THEME export

### Styling Pattern

```typescript
import { cn } from '@/lib/utils';

<View className={cn("flex-1 p-4", someCondition && "bg-primary")} />
```

---

## Key Patterns

### 1. Layout Groups

Use `(groupName)` in `app/` to organize routes without affecting URLs:

```
app/(auth)/sign-in.tsx → /sign-in (not /auth/sign-in)
```

### 2. Portal Pattern

```typescript
// In root _layout.tsx
<PortalHost />

// In any component
<Portal>
  <Dialog>...</Dialog>
</Portal>
```

### 3. Theme Provider

Root layout wraps app in `ThemeProvider` from `@react-navigation/native` with dynamic theme based on color scheme.

### 4. Constants with `as const`

```typescript
export const DayOfWeek = {
  Sunday: 0,
  Monday: 1,
  // ...
} as const;

// Derive type automatically
type DayOfWeekValue = (typeof DayOfWeek)[keyof typeof DayOfWeek];
```

### 5. Secure Token Storage

All auth tokens stored in `expo-secure-store`, never in AsyncStorage or plain localStorage.

---

## Development Commands

```bash
npm run dev          # Start Expo dev server (clears cache)
npm run ios          # Launch on iOS simulator
npm run android      # Launch on Android emulator
npm run web          # Run on web browser
npm run clean        # Clear .expo and node_modules
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run Jest tests
```

---

## Configuration Files

### `babel.config.js`

- Configures NativeWind preset
- Module resolver for `@better-auth` imports (compatibility fix)

### `metro.config.js`

- NativeWind CSS transformation
- **Critical**: `unstable_enablePackageExports: true` for Better Auth compatibility

### `drizzle.config.ts`

- Dialect: `turso`
- Schema: `./db/schemas/*`
- Migrations: `./db/migrations/`

### `app.json`

- Scheme: `ui-gohan` (for deep linking)
- New Architecture enabled
- Edge-to-edge mode enabled

### `.env.local` (not in repo)

Required environment variables:

```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:8081
RESEND_API_KEY=...
```

---

## Current Development Phase

### ✅ Completed (Phase 1)

- Project setup with Expo + TypeScript
- UI library integration (React Native Reusables + NativeWind)
- Better Auth configuration (server + client)
- Turso Cloud + Drizzle ORM setup
- Metro bundler configuration for Better Auth

### 🚧 In Progress (Phase 2 - MVP)

- Authentication screens implementation
- Database schema definition and migrations
- Home screen with weekly menu list
- Drag-and-drop menu reordering
- Offline-first data sync with Turso

### 📋 Planned (Future)

- Social login (Google, Apple)
- Guest-to-account migration
- Image upload for dishes
- Shopping list generation
- Android and Web versions

---

## Important Notes

1. **Better Auth Compatibility**: Requires `unstable_enablePackageExports` in Metro config and Babel module-resolver
2. **Offline-First**: Design all features to work offline with Turso's local replica sync
3. **Type Safety**: Use `as const` pattern for constants to derive types automatically
4. **Auth Guards**: Check `session?.user` before rendering authenticated content
5. **Development Database**: Use local SQLite replica during development for faster iteration

---

## Resources

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [React Native Reusables](https://rnr-docs.vercel.app/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Turso Documentation](https://docs.turso.tech/)

---

**Full Project Specification**: See `docs/SPEC.md` for comprehensive technical details.
**Task Tracking**: See `docs/TODO.md` for detailed development roadmap.
