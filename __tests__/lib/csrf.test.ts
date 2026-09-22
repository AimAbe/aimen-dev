import { describe, it, expect } from 'vitest'
import { validateOrigin } from '@/lib/csrf'

const makeRequest = (headers: Record<string, string>) =>
  new Request('http://localhost/api/posts', { headers })

describe('validateOrigin', () => {
  it('returns true when origin host matches request host', () => {
    const req = makeRequest({ origin: 'https://aimen.dev', host: 'aimen.dev' })
    expect(validateOrigin(req)).toBe(true)
  })

  it('returns true when origin and host both include matching ports', () => {
    const req = makeRequest({ origin: 'http://localhost:3000', host: 'localhost:3000' })
    expect(validateOrigin(req)).toBe(true)
  })

  it('returns false when origin host differs from request host', () => {
    const req = makeRequest({ origin: 'https://evil.com', host: 'aimen.dev' })
    expect(validateOrigin(req)).toBe(false)
  })

  it('returns false when ports differ', () => {
    const req = makeRequest({ origin: 'http://localhost:4000', host: 'localhost:3000' })
    expect(validateOrigin(req)).toBe(false)
  })

  it('returns false when the origin header is missing', () => {
    const req = makeRequest({ host: 'aimen.dev' })
    expect(validateOrigin(req)).toBe(false)
  })

  it('returns false when the host header is missing', () => {
    const req = makeRequest({ origin: 'https://aimen.dev' })
    expect(validateOrigin(req)).toBe(false)
  })

  it('returns false when the origin header is not a valid URL', () => {
    const req = makeRequest({ origin: 'not-a-url', host: 'aimen.dev' })
    expect(validateOrigin(req)).toBe(false)
  })
})
