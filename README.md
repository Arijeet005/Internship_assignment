# Help Study Abroad — Admin Dashboard

A full-featured admin dashboard built with **Next.js 15**, **MUI v5**, **Zustand**, and **NextAuth**, consuming the [DummyJSON](https://dummyjson.com/) public API.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | File-based routing, SSR/SSG, API routes |
| UI | Material-UI v5 | Rich component library, responsive system |
| State | Zustand | Minimal boilerplate, built-in async, no Provider wrapping |
| Auth | NextAuth.js | Secure session management with JWT strategy |
| Language | TypeScript | Type safety across the entire codebase |

---

## Features

### Authentication
- Login via DummyJSON `/auth/login`
- Managed by NextAuth (JWT session) + Zustand (token access)
- Protected routes — unauthenticated users are redirected to `/login`
- Token persisted in `localStorage` via Zustand `persist` middleware

### Users Module
- Paginated users list (10 per page) with server-side pagination
- Real-time search with 400ms debounce
- Responsive table (desktop) / card layout (mobile)
- Full user detail page: contact, company, personal info

### Products Module
- Paginated products grid (12 per page)
- Search bar with debounce
- Category filter dropdown (fetched from API)
- Product detail: image carousel with thumbnails, specs, reviews

### State Management (Zustand)
- `authStore` — user session + token, persisted to localStorage
- `usersStore` — users list, pagination, search, per-query caching
- `productsStore` — products list, categories, single product cache

### Performance
- `React.memo` on table rows and product cards
- `useCallback` / `useMemo` throughout list pages
- API-side pagination (never loads full datasets)
- 5-minute TTL cache in Zustand keyed by search+page+category
- Single product cache by ID (no repeat fetch on back-navigation)

---

## Setup & Installation

### Prerequisites
- Node.js >= 18
- npm >= 9

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/help-study-abroad.git
cd help-study-abroad

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local if needed (defaults work for local dev)

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXTAUTH_URL` | Full URL of your app | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Set a strong random string in production |

---

## Demo Credentials

Use any valid DummyJSON user:

| Username | Password |
|---|---|
| `emilys` | `emilyspass` |
| `michaelw` | `michaelwpass` |

Full list: https://dummyjson.com/users

---

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth handler
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard home
│   │   ├── users/
│   │   │   ├── page.tsx          # Users list
│   │   │   └── [id]/page.tsx     # User detail
│   │   └── products/
│   │       ├── page.tsx          # Products list
│   │       └── [id]/page.tsx     # Product detail
│   ├── login/page.tsx            # Login page
│   └── layout.tsx                # Root layout (providers)
├── components/
│   ├── layout/
│   │   ├── AuthGuard.tsx         # Route protection HOC
│   │   └── DashboardLayout.tsx   # Sidebar + shell
│   ├── AuthProvider.tsx          # NextAuth SessionProvider
│   └── MuiProvider.tsx           # MUI ThemeProvider
├── lib/
│   ├── theme.ts                  # Custom MUI theme
│   └── useDebounce.ts            # Debounce hook
├── store/
│   ├── authStore.ts              # Auth Zustand store
│   ├── usersStore.ts             # Users Zustand store
│   └── productsStore.ts          # Products Zustand store
└── types/
    └── index.ts                  # TypeScript interfaces
```

---

## Why Zustand?

- **No boilerplate**: Define state + actions in a single `create()` call
- **Built-in async**: Async functions live directly in the store — no thunks/sagas
- **Small bundle**: ~1KB gzipped vs Redux Toolkit at ~11KB
- **No Provider needed**: Stores are module singletons — import and use anywhere
- **TypeScript-first**: Excellent inference out of the box
- **Persist middleware**: Easy localStorage integration with one import

For a small–medium app like this dashboard, Zustand hits the sweet spot of power and simplicity.
