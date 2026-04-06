# aimen.dev

Personal developer blog documenting my journey learning fullstack development. The blog itself is the subject of its own posts — every build decision, error, and fix gets written up honestly.

Live at [aimen.dev](https://aimen.dev) *(coming soon)*

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL on Railway |
| ORM | Prisma |
| Auth | NextAuth.js (GitHub OAuth) |
| Email | Resend |
| Styling | Tailwind CSS v4 + Typography |
| Deployment | Vercel |

---

## Features

- **Blog** — Markdown posts stored in Postgres, rendered with `react-markdown`
- **CMS** — Admin editor for writing and publishing posts *(Step 3)*
- **Comments** — Reader comments with moderation queue *(Step 5)*
- **Reactions** — Emoji reactions, no login required *(Step 4)*
- **Newsletter** — Double opt-in subscriber list *(Step 6)*
- **Auth** — GitHub OAuth locked to admin email only *(Step 3)*

---

## Project Structure

```
aimen-dev/
├── app/
│   ├── blog/
│   │   ├── page.tsx              # Post listing
│   │   └── [slug]/page.tsx       # Individual post
│   ├── admin/                    # Coming in Step 3
│   ├── api/
│   │   ├── posts/route.ts        # GET all, POST new
│   │   └── posts/[slug]/route.ts # GET single
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── lib/
│   └── db.ts                     # Prisma singleton
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Railway](https://railway.app) account (for Postgres)
- A [Vercel](https://vercel.com) account (for deployment)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/aimen-dev.git
cd aimen-dev

# Install dependencies (also runs prisma generate via postinstall)
npm install

# Copy env example and fill in your values
cp .env.example .env
```

### Environment Variables

```bash
DATABASE_URL=        # Railway Postgres connection string
ADMIN_EMAIL=         # Your email — only this account can log in
AUTH_SECRET=         # Random string: openssl rand -base64 32
RESEND_API_KEY=      # From resend.com
```

### Database Setup

```bash
# Push schema to your Railway database
npx prisma db push

# Seed with initial posts
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# Open Prisma Studio to verify
npx prisma studio
```

### Run Locally

```bash
npm run dev
```

Visit:
- `localhost:3000` — homepage
- `localhost:3000/blog` — post listing
- `localhost:3000/blog/[slug]` — individual post
- `localhost:3000/api/posts` — posts API

---

## Build Progress

| Step | Description | Status |
|------|-------------|--------|
| 1 | Next.js + Prisma + Railway setup | ✅ Done |
| 2 | Posts API + blog pages + Markdown rendering | ✅ Done |
| 3 | Auth + admin editor | ✅ Done |
| 4 | Emoji reactions | ⏳ Pending |
| 5 | Comments + moderation | ⏳ Pending |
| 6 | Newsletter + double opt-in | ⏳ Pending |

Each step is documented as a blog post on the site itself.

---

## Known Issues / Errors Encountered

A running log of real errors hit during the build — documented here and in the blog posts.

| Error | Cause | Fix |
|-------|-------|-----|
| `MODULE_NOT_FOUND @prisma/client` | `prisma generate` not run after `db push` | `npx prisma generate` — now auto-runs via `postinstall` |
| `GET /blog` returning 404 | Dev server not restarted after fixing module error | Restart dev server after any module-level fix |
| Unstyled prose content | `@tailwindcss/typography` not installed | Install plugin + add `@plugin` directive in `globals.css` (Tailwind v4 syntax) |

---

## Blog Posts

Posts are written in Markdown and stored in the database. To add a new post, either use the admin editor (Step 3) or add it to `prisma/seed.ts` and re-run the seed script.

---

## Notes

- Built with [Claude](https://claude.ai) as a technical advisor and educator
- Dark editorial design: Instrument Serif + JetBrains Mono, acid green `#c8ff57`
- All build decisions documented honestly — including the errors

---

*This README is updated at the end of each build step.*
