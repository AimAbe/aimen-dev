# Authentication Review & Troubleshooting

## Overview
This document captures a full authentication review of the aimen.dev login system. It uses **NextAuth.js v5 (beta)** with GitHub OAuth for admin access.

---

## Current Authentication Flow

### Architecture
1. **`lib/auth.ts`** - NextAuth.js v5 configuration with GitHub provider
2. **`app/api/auth/[...nextauth]/route.ts`** - API route handler
3. **`app/login/page.tsx`** - Login page with server action
4. **`proxy.ts`** - Next.js middleware protecting `/admin` routes

### Flow
```
User clicks "sign in with github"
    ↓
form action → signIn('github', { redirectTo: '/admin' })
    ↓
User redirected to GitHub OAuth consent screen
    ↓
GitHub OAuth callback → /api/auth/callback/github
    ↓
NextAuth validates: profile.email === process.env.ADMIN_EMAIL
    ↓
If match → Create session → Redirect to /admin
If no match → Reject login
    ↓
Middleware (proxy.ts) protects /admin/* routes
```

---

## Issues Identified

### 🔴 Issue 1: Missing Email Validation Error Handling
**Location**: `lib/auth.ts` (lines 7-9)

**Problem**:
```typescript
signIn({ profile }) {
  return profile?.email === process.env.ADMIN_EMAIL
}
```

- No error handling if `ADMIN_EMAIL` is undefined
- GitHub doesn't always return `profile.email` (users can make email private)
- Case-sensitive comparison fails if emails differ by case
- No logging makes debugging impossible
- Silent failures - users won't know why login was rejected

**Fix**:
```typescript
signIn({ profile }) {
  if (!process.env.ADMIN_EMAIL) {
    console.error('[AUTH] ADMIN_EMAIL environment variable not configured')
    return false
  }
  
  const userEmail = profile?.email?.toLowerCase() || ''
  const adminEmail = process.env.ADMIN_EMAIL.toLowerCase()
  
  if (!userEmail) {
    console.warn('[AUTH] GitHub profile email not available (may be private)')
    return false
  }
  
  if (userEmail !== adminEmail) {
    console.warn(`[AUTH] Login rejected: ${userEmail} does not match ${adminEmail}`)
    return false
  }
  
  console.log(`[AUTH] Successful login: ${userEmail}`)
  return true
}
```

---

### 🔴 Issue 2: No Error Feedback in Login UI
**Location**: `app/login/page.tsx`

**Problem**:
- Login page is a server component with no error state handling
- Users see nothing if OAuth fails
- No loading state feedback
- No indication that login was rejected

**Fix**: Convert to client component with error/loading states
```tsx
'use client'

import { signIn } from '@/lib/auth'
import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setError(null)
      setLoading(true)
      await signIn('github', { redirectTo: '/admin' })
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'Authentication failed. Check that your GitHub email is public and matches the configured admin email.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ /* existing styles */ }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <pre className="ascii-logo">{LOGO}</pre>
        
        <p className="t-meta" style={{ marginBottom: 'var(--s-4)' }}>
          <span className="t-prompt">$&nbsp;</span>sudo login --admin
        </p>

        <hr className="hr-rule" />

        <p className="t-body" style={{ marginBottom: 'var(--s-5)' }}>
          restricted access. github oauth — only the configured admin email may sign in.
        </p>

        {error && (
          <div 
            style={{
              padding: 'var(--s-3)',
              marginBottom: 'var(--s-4)',
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              borderRadius: '4px',
              color: '#ff4444'
            }}
          >
            <p className="t-body">{error}</p>
          </div>
        )}

        <form
          action={async () => {
            'use server'
            await signIn('github', { redirectTo: '/admin' })
          }}
        >
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '[ signing in... ]' : '[ sign in with github ]'}
          </button>
        </form>

        <p className="t-meta" style={{ marginTop: 'var(--s-5)' }}>
          <span className="t-mute2">// </span>everyone else: nothing to see here. <a href="/" className="t-link">cd /</a>
        </p>
      </div>
    </div>
  )
}
```

---

### ⚠️ Issue 3: NextAuth.js v5 Beta Stability
**Location**: `package.json`

**Problem**:
```json
"next-auth": "^5.0.0-beta.30"
```

- Still in beta (may have bugs)
- No stable release guarantee
- Potential breaking changes

**Recommendation**:
- Monitor NextAuth.js releases for v5 stable
- Plan migration path when stable releases are available
- Consider staying on v4 if stability is critical

---

### ⚠️ Issue 4: GitHub Email Privacy
**Problem**:
GitHub OAuth doesn't return email if:
- User's email is set to private on GitHub
- User has multiple emails and primary isn't configured

**Fix**:
1. Go to https://github.com/settings/emails
2. Set your email as **primary**
3. Make sure it's **public** (or at least not hidden from apps)

---

## Diagnostic Checklist

Before going to production or after experiencing login issues, verify:

### Environment Variables
- [ ] `GITHUB_ID` is set and matches your OAuth app ID
- [ ] `GITHUB_SECRET` is set and valid
- [ ] `AUTH_SECRET` is generated (run: `npx auth secret`)
- [ ] `ADMIN_EMAIL` is set to your GitHub primary email (lowercase)
- [ ] `DATABASE_URL` is configured for PostgreSQL

### GitHub OAuth App
- [ ] OAuth app exists: https://github.com/settings/developers
- [ ] Authorization callback URL is exactly: `https://aimen.dev/api/auth/callback/github`
- [ ] App has `user:email` and `read:user` scopes
- [ ] App is not revoked or deleted

### GitHub Account
- [ ] Your email is set as **primary**: https://github.com/settings/emails
- [ ] Email is **public** (not hidden)
- [ ] Email matches `ADMIN_EMAIL` exactly (case-insensitive, but consistent)
- [ ] No two-factor authentication issues

### Application
- [ ] Application is running and deployed
- [ ] Check server logs for authentication errors
- [ ] Test in incognito/private mode (fresh session, no cached cookies)
- [ ] Verify middleware (`proxy.ts`) is protecting `/admin` routes

---

## Testing Authentication

### Local Testing
```bash
# 1. Create .env.local with test values
GITHUB_ID=your_test_oauth_id
GITHUB_SECRET=your_test_oauth_secret
AUTH_SECRET=$(npx auth secret)
ADMIN_EMAIL=your.email@github.com

# 2. Run dev server
npm run dev

# 3. Visit http://localhost:3000/login
# 4. Click sign in and test OAuth flow

# 5. Check console for [AUTH] logs
```

### Production Testing
- [ ] Test login after deployment
- [ ] Check application logs for errors
- [ ] Verify admin dashboard is accessible after login
- [ ] Test that non-admin GitHub accounts are rejected

---

## Common Errors & Solutions

### "Sign in form not submitted"
- GitHub OAuth callback URL doesn't match your app config
- Check: https://github.com/settings/developers → your app → Callback URL

### "Cannot find provider"
- `GITHUB_ID` or `GITHUB_SECRET` missing from environment
- Verify `.env` file is loaded in your deployment

### "Email not found in profile"
- Your GitHub email is set to private
- Go to https://github.com/settings/emails and make it public

### "Email doesn't match admin email"
- `ADMIN_EMAIL` has different case or whitespace
- Email doesn't exactly match your GitHub primary email
- Check logs to see what email GitHub returned

### Session not persisting
- `AUTH_SECRET` is missing or invalid
- Regenerate: `npx auth secret`

---

## Related Files

- **Main auth config**: `lib/auth.ts`
- **API handler**: `app/api/auth/[...nextauth]/route.ts`
- **Login page**: `app/login/page.tsx`
- **Admin middleware**: `proxy.ts`
- **Env template**: Create `.env.local` from values in README.md

---

## Next Steps

1. Apply fixes from Issue 1 & 2 above
2. Run through diagnostic checklist
3. Test login flow locally
4. Deploy and verify in production
5. Monitor server logs for `[AUTH]` messages

---

**Last Updated**: August 28, 2026
**Status**: Pending fixes for error handling and logging
