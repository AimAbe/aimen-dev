import { signIn } from '@/lib/auth'

const LOGO = String.raw`
       _                             _            
  __ _(_)_ __ ___   ___ _ __      __| | _____   __
 / _` | | '_ ` _ \ / _ \ '_ \    / _` |/ _ \ \ / /
| (_| | | | | | | |  __/ | | |  | (_| |  __/\ V / 
 \__,_|_|_| |_| |_|\___|_| |_(_) \__,_|\___| \_/  
`

export default function LoginPage() {
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

        <form
          action={async () => {
            'use server'
            await signIn('github', { redirectTo: '/admin' })
          }}
        >
          <button type="submit" className="btn btn-primary">
            [ sign in with github ]
          </button>
        </form>

        <p className="t-meta" style={{ marginTop: 'var(--s-5)' }}>
          <span className="t-mute2">// </span>everyone else: nothing to see here. <a href="/" className="t-link">cd /</a>
        </p>
      </div>
    </div>
  )
}
