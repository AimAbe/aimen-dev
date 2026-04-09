# aimen.dev

Personal developer blog built with Next.js, Prisma, and GitHub-authenticated admin tools. The site documents learning and fullstack experiments while serving as a real content platform with markdown posts, reactions, and comment moderation.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Typography |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js (GitHub OAuth) |
| Rendering | `react-markdown` |

---

## Features

- Public blog listing with search
- Markdown blog posts rendered with `react-markdown`
- Emoji reactions persisted per browser session
- Comments with moderation workflow
- Admin dashboard for creating, editing, and publishing posts
- GitHub login restricted to a configured admin email

---

## Project Structure

```
aimen-dev/
├── app/
│   ├── admin/
│   │   ├── comments/page.tsx
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
│   │   ├── [slug]/page.tsx
│   │   └── page.tsx
│   ├── login/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── app/components/
│   ├── CommentForm.tsx
│   ├── CommentsDisplay.tsx
│   ├── Layout.tsx
│   ├── ModerationClient.tsx
│   ├── PostNav.tsx
│   ├── Reactions.tsx
│   └── Search.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── getAdjacentPosts.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── package.json
├── README.md
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/aimen-dev.git
cd aimen-dev
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```bash
DATABASE_URL=your_postgres_connection_string
ADMIN_EMAIL=your_admin_github_email
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
```

### Database Setup

```bash
npx prisma db push
npx npm exec tsx prisma/seed.ts
npx prisma studio
```

### Run Locally

```bash
npm run dev
```

Visit:
- `http://localhost:3000`
- `http://localhost:3000/blog`
- `http://localhost:3000/blog/[slug]`
- `http://localhost:3000/login`
- `http://localhost:3000/admin`

---

## Deployment

1. Push your repository to GitHub.
2. Visit [Vercel](https://vercel.com) and import the repo.
3. Set the environment variables in Vercel:
   - `DATABASE_URL`
   - `ADMIN_EMAIL`
   - `GITHUB_ID`
   - `GITHUB_SECRET`
4. Deploy the app.

Vercel will build the Next.js app automatically.

---

## Notes

- Admin access is protected with GitHub OAuth and limited to the configured `ADMIN_EMAIL`.
- Comments are created as unapproved and must be approved through the admin moderation UI.
- Reactions use a browser session cookie to prevent duplicate votes.
- The admin post editor supports draft and publish flows via `app/admin/components/PostEditor.tsx`.

---

## Current Status

The app currently includes:

- Blog pages powered by Prisma
- Markdown post rendering
- Search on the blog listing
- Admin dashboard and post editor
- Comment submission and moderation
- Emoji reactions
- GitHub-based admin authentication

