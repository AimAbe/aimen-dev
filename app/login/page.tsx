'use client'

import { signIn } from '@/lib/auth'
import { useState } from 'react'

const LOGO = String.raw`
   __ _(_)_ __ ___   ___ _ __    __| | _____   __
  / _\` | | '_ \` _ \ / _ \ '_ \  / _\` |/ _ \ \ / /
 | (_| | | | | | | |  __/ | | || (_| |  __/\ V /
  \__,_|_|_| |_| |_|\___|_| |_(_)__,_|\___| \_/
`

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    try {
      setError(null)
      setLoading(true)
      await signIn('github', { redirectTo: '/admin' })
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please verify that your GitHub email is public and matches the configured admin email.'
      setError(errorMessage)
      console.error('[AUTH] Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        padding: 'var(--s-4)',
      }}
    >
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
              color: '#ff4444',
            }}
          >
            <p className="t-body" style={{ margin: 0 }}>
              {error}
            </p>
            <p className="t-meta" style={{ margin: '8px 0 0 0', color: '#ff6666' }}>
              <span className="t-mute2">// </span>Check that your GitHub email is public and
              matches the admin email.
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSignIn()
          }}
        >
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '[ signing in... ]' : '[ sign in with github ]'}
          </button>
        </form>

        <p className="t-meta" style={{ marginTop: 'var(--s-5)' }}>
          <span className="t-mute2">// </span>everyone else: nothing to see here.{' '}
          <a href="/" className="t-link">
            cd /
          </a>
        </p>
      </div>
    </div>
  )
}
