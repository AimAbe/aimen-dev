import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0c0c0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
          color: '#c8ff57', letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          // admin access
        </p>
        <h1 style={{
          fontFamily: 'Instrument Serif, serif', fontSize: '40px',
          fontWeight: 400, color: '#e8e6f0', marginBottom: '8px'
        }}>
          aimen.dev
        </h1>
        <p style={{ color: '#6b6880', fontSize: '14px', marginBottom: '40px' }}>
          Sign in to access the admin area
        </p>
        <form action={async () => {
          'use server'
          await signIn('github', { redirectTo: '/admin' })
        }}>
          <button type="submit" style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '14px 32px',
            background: '#c8ff57', color: '#0c0c0f',
            border: 'none', borderRadius: '3px',
            cursor: 'pointer', fontWeight: 500
          }}>
            Sign in with GitHub
          </button>
        </form>
        <p style={{ marginTop: '24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6b6880' }}>
          restricted access · admin only
        </p>
      </div>
    </div>
  )
}