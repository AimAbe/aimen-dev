import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#1E2430',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Sora, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
          color: '#89B4FA', letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          // admin access
        </p>
        <h1 style={{
          fontFamily: 'Lora, serif', fontSize: '40px',
          fontWeight: 400, color: '#CDD6F4', marginBottom: '8px'
        }}>
          aimen.dev
        </h1>
        <p style={{ color: '#6C7393', fontSize: '14px', marginBottom: '40px' }}>
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
            background: '#89B4FA', color: '#1E2430',
            border: 'none', borderRadius: '3px',
            cursor: 'pointer', fontWeight: 500
          }}>
            Sign in with GitHub
          </button>
        </form>
        <p style={{ marginTop: '24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6C7393' }}>
          restricted access · admin only
        </p>
      </div>
    </div>
  )
}