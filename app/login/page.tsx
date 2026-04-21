import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center font-sans">
      <div className="text-center">
        <p className="font-mono text-[11px] text-accent tracking-[0.15em] uppercase mb-4">
          // admin access
        </p>
        <h1 className="font-serif text-[40px] font-normal text-text mb-2">
          aimen.dev
        </h1>
        <p className="text-text-muted text-sm mb-10">
          Sign in to access the admin area
        </p>
        <form action={async () => {
          'use server'
          await signIn('github', { redirectTo: '/admin' })
        }}>
          <button
            type="submit"
            className="font-mono text-xs tracking-[0.08em] uppercase px-8 py-3.5 bg-accent text-bg border-none rounded cursor-pointer font-medium hover:opacity-90 transition-opacity"
          >
            Sign in with GitHub
          </button>
        </form>
        <p className="mt-6 font-mono text-[10px] text-text-muted">
          restricted access · admin only
        </p>
      </div>
    </div>
  )
}
