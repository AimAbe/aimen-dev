> Paste this entire message into Claude Code, opened in the root of your `aimen-dev` repo.

---

# Task

Apply the **aimen.dev terminal redesign** to this repo, commit, push, and deploy.

The handoff folder `production/` (in this same directory) contains 17 fully-written TSX / CSS / JS files that are drop-in replacements for the existing styled layer. They are **not mockups** — they are production-ready code, written in the target stack (Next.js 16 App Router, React 19, Tailwind v4, TypeScript). No translation step needed.

## What changed

This is a **visual overhaul only**. The DB schema, auth flow, API routes, middleware, tests, Prisma config, and `next.config.ts` are **untouched**. The redesign:

- Replaces three fonts (Sora, Lora, JetBrains Mono) with **JetBrains Mono only**
- Replaces the blue + 4 tag-color accent palette with **one amber accent** (`#FFB454` dark, `#B5651D` light)
- Removes the hero, ticker, about strip, status pulse, fade-up animations, backdrop blur, card shadows, and hover-line decorations
- Adopts a **terminal/manpage** aesthetic — `$` prompts, `[bracketed]` labels, dashed hairline dividers, no rounded corners past 2px
- Implements **light + dark tokens** scoped to `[data-theme="dark|light"]` on `<html>`
- Keeps **all data shapes, API signatures, and route paths identical** to the original

See `production/preview.html` for a visual contract — every screen rendered with the exact CSS this is about to deploy.

## Files modified (17, all replacements)

```
app/globals.css
app/layout.tsx
app/page.tsx
app/blog/[slug]/page.tsx
app/blog/page.tsx                      ← unchanged but included for completeness
app/components/Layout.tsx
app/components/Reactions.tsx
app/components/CommentForm.tsx
app/components/CommentsDisplay.tsx
app/components/Search.tsx
app/components/PostNav.tsx
app/components/ModerationClient.tsx
app/login/page.tsx
app/admin/page.tsx
app/admin/comments/page.tsx
app/admin/new/page.tsx                 ← unchanged but included for completeness
app/admin/edit/[slug]/page.tsx
app/admin/components/PostEditor.tsx
tailwind.config.js
```

## Steps for you (Claude Code)

1. **Verify the current `aimen-dev` repo is clean.** Run `git status`. If there are uncommitted changes, ask me before continuing.

2. **Create a new branch.**
   ```bash
   git checkout -b terminal-redesign
   ```

3. **Apply the redesign.** Copy every file in `production/app/` to `app/` (overwriting), and `production/tailwind.config.js` to `tailwind.config.js`.
   ```bash
   cp -r production/app/* app/
   cp production/tailwind.config.js tailwind.config.js
   ```

4. **Sanity check** — run the dev server and confirm:
   - `/` shows the manpage layout
   - `/blog/[slug]` shows the terminal reader
   - `/admin` shows the `ls -la` table
   - `/login` shows the ASCII logo + bracketed signin button
   - Console is clean, no hydration warnings

   ```bash
   npm run dev
   ```

5. **Run tests** to make sure nothing regressed.
   ```bash
   npm run test
   ```
   The tests cover API routes, the data layer, and a few components. None of those layers were touched in this redesign — they should all pass. If a component test fails because it asserts on Tailwind class names (e.g. `bg-bg-card`) that no longer exist, update the test to assert on the new selector. **Do not rewrite the component to satisfy the old test.**

6. **Commit.**
   ```bash
   git add -A
   git commit -m "terminal redesign: monospaced, single accent, light+dark tokens

   17 files changed across the styled layer. DB, auth, API routes, and tests
   are untouched. Replaces Sora/Lora + 4 tag colors with JetBrains Mono +
   single amber accent. Adopts manpage layout for home, ls-la for admin.
   See production/README.md for the full visual contract."
   ```

7. **Push and open the PR.**
   ```bash
   git push -u origin terminal-redesign
   gh pr create --title "Terminal redesign" --body-file production/README.md
   ```

8. **After merging, Vercel auto-deploys.** (The original README says this repo deploys via Vercel on push to `main`.) If the user wants to skip the PR step and ship straight to `main`, ask them first.

## Things to NOT do

- Don't touch anything in `lib/`, `prisma/`, `app/api/`, `proxy.ts`, `next.config.ts`, or `__tests__/`.
- Don't add `'use client'` to any server-rendered file in `production/`. The boundary is already drawn correctly.
- Don't change the tag taxonomy strings (`build log`, `deep dive`, etc.) — they're stored verbatim in the DB.
- Don't replace the emoji reactions. They're stored as emoji strings in the DB; the new design intentionally keeps them inside bracketed mono chips.

## Open questions to ask the user before deploying

1. **Light mode toggle?** Light tokens are wired but `<html data-theme="dark">` is hard-coded. If they want a toggle, add a small `'use client'` component that flips the attribute and persists to `localStorage`. Put it next to the `./feed.xml` link in `app/components/Layout.tsx`.

2. **Dedicated `/about` page?** The bio currently lives in the DESCRIPTION block of the manpage. If they want a separate page, ask for the copy.

3. **Replace the `public/file.svg` / `globe.svg` / `window.svg`?** These are unused Next.js scaffold SVGs. Safe to delete.

## Files to read first

- `production/README.md` — the full handoff doc, including a diff sketch and known caveats.
- `production/preview.html` — open this in a browser to see exactly what the user signed off on. The CSS in this file is the same CSS deploying.
- `production/app/globals.css` — the canonical source of truth for every visual token in the system.

That's everything. Go.
