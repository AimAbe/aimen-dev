import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: vi.fn().mockImplementation(function () {}) }))
vi.mock('@prisma/client', () => ({ PrismaClient: vi.fn().mockImplementation(function () {}) }))
vi.mock('pg', () => ({ Pool: vi.fn().mockImplementation(function () {}) }))

import { withDbRetry } from '@/lib/db'

const startingUpError = () => {
  const err = new Error('the database system is starting up') as Error & {
    cause?: { code: string }
  }
  err.cause = { code: '57P03' }
  return err
}

describe('withDbRetry', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the result on the first success without retrying', async () => {
    const fn = vi.fn().mockResolvedValue('ok')

    await expect(withDbRetry(fn)).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on a 57P03 "database starting up" error and eventually succeeds', async () => {
    vi.useFakeTimers()
    const fn = vi
      .fn()
      .mockRejectedValueOnce(startingUpError())
      .mockRejectedValueOnce(startingUpError())
      .mockResolvedValue('ok')

    const promise = withDbRetry(fn)
    await vi.runAllTimersAsync()

    await expect(promise).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('gives up after exhausting retries and throws the last error', async () => {
    vi.useFakeTimers()
    const err = startingUpError()
    const fn = vi.fn().mockRejectedValue(err)

    const promise = withDbRetry(fn, 2)
    const expectation = expect(promise).rejects.toBe(err)
    await vi.runAllTimersAsync()
    await expectation

    expect(fn).toHaveBeenCalledTimes(3) // initial attempt + 2 retries
  })

  it('throws immediately on an unrelated error without retrying', async () => {
    const err = new Error('some other failure')
    const fn = vi.fn().mockRejectedValue(err)

    await expect(withDbRetry(fn)).rejects.toBe(err)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
