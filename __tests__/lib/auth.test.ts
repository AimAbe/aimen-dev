import { describe, it, expect, vi, afterEach } from 'vitest'

type SignInArgs = { profile?: { email?: string | null } }

const { captured } = vi.hoisted(() => ({
  captured: {} as { signIn?: (args: SignInArgs) => boolean },
}))

vi.mock('next-auth', () => ({
  default: vi.fn((config: any) => {
    captured.signIn = config.callbacks.signIn
    return { handlers: {}, auth: vi.fn(), signIn: vi.fn(), signOut: vi.fn() }
  }),
}))

vi.mock('next-auth/providers/github', () => ({
  default: vi.fn((opts: any) => opts),
}))

import '@/lib/auth'

describe('auth signIn callback', () => {
  const originalAdminEmail = process.env.ADMIN_EMAIL

  afterEach(() => {
    process.env.ADMIN_EMAIL = originalAdminEmail
  })

  it('rejects sign-in when ADMIN_EMAIL is not configured', () => {
    delete process.env.ADMIN_EMAIL

    expect(captured.signIn!({ profile: { email: 'admin@example.com' } })).toBe(false)
  })

  it('rejects sign-in when the GitHub profile has no email', () => {
    process.env.ADMIN_EMAIL = 'admin@example.com'

    expect(captured.signIn!({ profile: {} })).toBe(false)
    expect(captured.signIn!({})).toBe(false)
  })

  it('rejects a non-admin email', () => {
    process.env.ADMIN_EMAIL = 'admin@example.com'

    expect(captured.signIn!({ profile: { email: 'someone-else@example.com' } })).toBe(false)
  })

  it('accepts the admin email, case-insensitively and trimmed', () => {
    process.env.ADMIN_EMAIL = 'admin@example.com'

    expect(captured.signIn!({ profile: { email: '  Admin@Example.com  ' } })).toBe(true)
  })
})
