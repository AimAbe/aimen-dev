import { signIn } from '@/lib/auth'

export default function LoginPage() {
  return (
    <main>
      <h1>Admin Login</h1>
      <form
        action={async () => {
          'use server'
          await signIn('github', { redirectTo: '/admin' })
        }}
      >
        <button type="submit">Sign in with GitHub</button>
      </form>
    </main>
  )
}