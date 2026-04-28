import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#141010',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '11px',
          color: '#E8B84B',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          // admin access
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '40px',
          fontWeight: 400,
          color: '#F7F3EE',
          margin: '0 0 8px',
        }}>
          aimen.dev
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#7A6F65',
          margin: '0 0 40px',
        }}>
          sign in to access the admin area
        </p>
        <form action={async () => {
          'use server'
          await signIn('github', { redirectTo: '/admin' })
        }}>
          <button
            type="submit"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '12px 32px',
              background: '#E8B84B',
              color: '#141010',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Sign in with GitHub
          </button>
        </form>
        <p style={{
          marginTop: '24px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#7A6F65',
        }}>
          restricted access · admin only
        </p>
      </div>
    </div>
  )
}
