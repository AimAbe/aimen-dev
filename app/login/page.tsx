'use client'

import { signIn } from 'next-auth/react'
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
    <div className="login">
      <div className="login-card">
        <p className="logo">aimen<span>.dev</span></p>
        <h1>Admin sign in</h1>
        <p className="login-note">Only the configured admin account can sign in.</p>
        {error && (
          <p className="form-error" role="alert" style={{ marginBottom: 20 }}>
            {error} Check that your GitHub email is public and matches the admin email.
          </p>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSignIn()
          }}
        >
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in with GitHub'}
          </button>
        </form>
      </div>
    </div>
  )
}
