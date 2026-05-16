# aimen-dev — terminal redesign handoff

A drop-in replacement for the styled layer of `AimAbe/aimen-dev`. Database, auth, and API routes are **untouched**.

## What's in this folder

Mirror of your `aimen-dev` repo, with the following files modified or added:

```
production/
├── app/
│   ├── globals.css                          ← REPLACES — terminal tokens, light+dark, no Tailwind colors
│   ├── layout.tsx                           ← REPLACES — JetBrains Mono only, data-theme="dark"
│   ├── page.tsx                             ← REPLACES — manpage home (NAME / SYNOPSIS / DESCRIPTION / SEARCH / POSTS / SEE ALSO)
│   ├── blog/
│   │   ├── page.tsx                         ← unchanged (still redirects to /)
│   │   └── [slug]/page.tsx                  ← REPLACES — terminal reader, $-prompted reader bar
│   ├── components/
│   │   ├── Layout.tsx                       ← REPLACES — terminal nav + footer
│   │   ├── Reactions.tsx                    ← REPLACES — bracketed reaction chips
│   │   ├── CommentForm.tsx                  ← REPLACES — terminal form
│   │   ├── CommentsDisplay.tsx              ← REPLACES — dashed-divider list
│   │   ├── Search.tsx                       ← REPLACES — $ prompt + mono dropdown
│   │   ├── PostNav.tsx                      ← REPLACES — bracketed prev/next
│   │   └── ModerationClient.tsx             ← REPLACES — bracketed approve/delete
│   ├── login/page.tsx                       ← REPLACES — ASCII logo + bracketed button
│   └── admin/
│       ├── page.tsx                         ← REPLACES — ls -la table
│       ├── new/page.tsx                     ← unchanged (re-exports PostEditor)
│       ├── edit/[slug]/page.tsx             ← REPLACES — Layout wrap on loading
│       ├── comments/page.tsx                ← REPLACES — terminal moderation
│       └── components/PostEditor.tsx        ← REPLACES — terminal form
└── tailwind.config.js                       ← REPLACES — tokens now in CSS vars; fonts unified to mono
```

**No changes** to: `lib/*`, `prisma/*`, `app/api/*`, `proxy.ts`, `next.config.ts`, `tsconfig.json`, `__tests__/*`.

## How to apply

```bash
# from the root of your aimen-dev repo, with this folder downloaded next to it:
cp -r production/app ./
cp production/tailwind.config.js ./

# then:
npm run dev
```

The site will be running on the new design system. Posts, comments, reactions, auth, admin — all functional, none touched at the data layer.

## What changed visually

- **Font:** Sora / Lora deleted. JetBrains Mono only, 400/500/600.
- **Color:** all blue accent + 4 tag colors deleted. One amber accent (`#FFB454` dark, `#B5651D` light).
- **Casing:** everything lowercase. Manpage section heads stay uppercase by convention (NAME, SYNOPSIS, …).
- **Tags:** rendered as `[build]`, no fills, no colors.
- **Hero:** removed. Site opens straight into the manpage.
- **Ticker:** removed.
- **About strip / "currently learning":** rolled into the DESCRIPTION section of the manpage.
- **Card chrome:** gone. Post rows are bare with dashed dividers.
- **Hover states:** text → accent + underline. That's it. No card lift, no color line.
- **Shadows / gradients / blurs:** all removed (including the nav backdrop blur).

## Light + dark mode

Tokens are scoped to `[data-theme="dark"]` and `[data-theme="light"]`. Currently the `<html>` is hard-coded to `data-theme="dark"` in `app/layout.tsx`. To wire a toggle:

1. Add a small `'use client'` component that flips `document.documentElement.dataset.theme` and persists to `localStorage`.
2. Mount it in the header (`app/components/Layout.tsx`).

A reference implementation lives in the design-system project's `ui_kits/blog/index.html`. Ask and I'll wire it for production.

## Reactions kept emoji

The system rule is *no emoji* — but reactions are the documented one-place exception (your DB stores `emoji` as a string column; the API expects emoji). The five-emoji chip set is kept. Each chip is now a bracketed mono pill, not the old blue/green color pair.

## Accessibility

- Color contrast verified for both themes at AA.
- Focus rings come from the browser default (intentional — terminals don't restyle focus).
- All interactive elements are real `<button>` / `<a>` with proper `aria-label` where icon-only.

## Known caveats / questions

1. **JetBrains Mono** is loaded from Google Fonts. If you want offline-safe rendering, drop the woff2 in `public/fonts/` and replace the `<link>` with a `@font-face` block in `globals.css`.
2. **Light mode is implemented but not toggle-able.** It's one component away. Want me to wire it?
3. **The "about" page** doesn't exist in your repo — the bio lives in the manpage DESCRIPTION. If you want a dedicated `/about`, I'll add one.
4. **The tag taxonomy** still uses your existing strings (`build log`, `deep dive`, `career`, `fullstack`). The new system renders them as `[build log]` etc. — if you want shorter forms, set the tag input to `build` on new posts.
5. **`react-markdown` + `rehype-sanitize`** are unchanged. The new `.prose` selectors in `globals.css` style the output. If your posts use HTML embeds the sanitizer doesn't allow, they still won't render.

## Diff sketch (for git)

```
M  app/globals.css
M  app/layout.tsx
M  app/page.tsx
M  app/blog/[slug]/page.tsx
M  app/components/Layout.tsx
M  app/components/Reactions.tsx
M  app/components/CommentForm.tsx
M  app/components/CommentsDisplay.tsx
M  app/components/Search.tsx
M  app/components/PostNav.tsx
M  app/components/ModerationClient.tsx
M  app/login/page.tsx
M  app/admin/page.tsx
M  app/admin/comments/page.tsx
M  app/admin/edit/[slug]/page.tsx
M  app/admin/components/PostEditor.tsx
M  tailwind.config.js
```

17 files changed, 0 added, 0 removed.
