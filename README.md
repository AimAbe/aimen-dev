# aimen.dev

Personal developer blog built with Next.js, Prisma, and GitHub-authenticated admin tools. The site documents learning and fullstack experiments while serving as a real content platform with markdown posts, reactions, and comment moderation.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | NextAuth.js v5 (GitHub OAuth) |
| Rendering | `react-markdown` + `rehype-sanitize` |

---

## Features

- Minimal homepage that doubles as the post listing, with live search
- Markdown posts rendered with `react-markdown` (HTML sanitized via `rehype-sanitize`)
- Emoji reactions persisted per browser session
- Comments with moderation workflow
- Admin dashboard for creating, editing, and publishing posts
- GitHub login restricted to a configured admin email
- Admin routes protected by Next.js middleware (`proxy.ts`)

---

## Project Structure

```
aimen-dev/
├── app/
│   ├── admin/
│   │   ├── comments/page.tsx
│   │   ├── components/PostEditor.tsx
│   │   ├── edit/[slug]/page.tsx
│   │   ├── new/page.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── comments/route.ts
│   │   ├── posts/route.ts
│   │   ├── posts/[slug]/route.ts
│   │   ├── reactions/route.ts
│   │   └── search/route.ts
│   ├── blog/
│   │   ├── [slug]/page.tsx   ← individual post
│   │   └── page.tsx          ← redirects to /
│   ├── components/
│   │   ├── CommentForm.tsx
│   │   ├── CommentsDisplay.tsx
│   │   ├── Layout.tsx
│   │   ├── ModerationClient.tsx
│   │   ├── PostNav.tsx
│   │   ├── Reactions.tsx
│   │   └── Search.tsx
│   ├── login/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              ← homepage + post listing
├── lib/
│   ├── auth.ts
│   ├── csrf.ts
│   ├── db.ts
│   ├── getAdjacentPosts.ts
│   └── useDebounce.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── proxy.ts                  ← Next.js middleware (admin auth)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

```bash
git clone https://github.com/AimAbe/aimen-dev.git
cd aimen-dev
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL=your_postgres_connection_string
ADMIN_EMAIL=your_admin_github_email
AUTH_SECRET=your_nextauth_secret        # generate with: npx auth secret
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
```

### Database Setup

```bash
npx prisma db push
npx tsx prisma/seed.ts
npx prisma studio      # optional: inspect data in browser
```

### Run Locally

```bash
npm run dev
```

Key routes:
- `http://localhost:3000` — homepage (post listing + search)
- `http://localhost:3000/blog/[slug]` — individual post
- `http://localhost:3000/login` — GitHub OAuth login
- `http://localhost:3000/admin` — admin dashboard (auth required)

---

## Deployment

1. Push the repository to GitHub.
2. Import the repo on [Vercel](https://vercel.com).
3. Set environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `AUTH_SECRET`
   - `GITHUB_ID`
   - `GITHUB_SECRET`
4. Deploy.

---

## Notes

- Admin access is gated by GitHub OAuth — only the configured `ADMIN_EMAIL` can sign in.
- `proxy.ts` at the project root enforces auth on all `/admin/*` routes (Next.js 16 middleware convention).
- Comments are created unapproved and require manual approval via the admin moderation UI.
- Reactions use an `httpOnly` session cookie to prevent duplicate votes per browser.
- Draft posts are only accessible to authenticated admins — unauthenticated requests receive 404.

---

## Testing

Tests use [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/). All external dependencies (database, auth, network) are mocked — the suite runs fully in-memory with no infrastructure required.

```bash
npm run test
```

### Coverage

| Area | What's tested |
|------|---------------|
| API — Posts | List, create, fetch, update, delete; auth guards; draft visibility |
| API — Comments | Submit, fetch, approve, delete; input validation |
| API — Admin | Pending comments endpoint; auth guards |
| API — Reactions | Fetch counts, create reactions, session cookie, duplicate prevention |
| API — Search | Query validation, full-text search, result limiting |
| Component — CommentForm | Renders, submits, loading and success states |
| Component — ModerationClient | Pending list, approve/delete actions, empty state |
| Component — Reactions | Emoji buttons, counts, click handling |
| Lib — getAdjacentPosts | Prev/next navigation including edge cases |
| Lib — useDebounce | Timing and rapid-change timer reset |
