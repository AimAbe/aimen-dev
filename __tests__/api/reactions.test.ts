import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    reaction: {
      groupBy: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

import { GET, POST } from '@/app/api/reactions/route'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

describe('GET /api/reactions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 400 when postId is missing', async () => {
    const req = new Request('http://localhost/api/reactions')
    const response = await GET(req)

    expect(response.status).toBe(400)
  })

  it('returns 400 when postId is not a number', async () => {
    const req = new Request('http://localhost/api/reactions?postId=abc')
    const response = await GET(req)

    expect(response.status).toBe(400)
  })

  it('returns grouped reaction counts', async () => {
    const mockReactions = [
      { emoji: '❤️', _count: 5 },
      { emoji: '🔥', _count: 2 },
    ]
    vi.mocked(prisma.reaction.groupBy).mockResolvedValue(mockReactions as any)

    const req = new Request('http://localhost/api/reactions?postId=1')
    const response = await GET(req)
    const data = await response.json()

    expect(prisma.reaction.groupBy).toHaveBeenCalledWith({
      by: ['emoji'],
      where: { postId: 1 },
      _count: true,
    })
    expect(data).toEqual(mockReactions)
  })
})

describe('POST /api/reactions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates a reaction and sets session cookie', async () => {
    const mockCookieStore = {
      get: vi.fn().mockReturnValue(undefined),
    }
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

    vi.mocked(prisma.reaction.create).mockResolvedValue({} as any)
    vi.mocked(prisma.reaction.groupBy).mockResolvedValue([
      { emoji: '❤️', _count: 1 },
    ] as any)

    const req = new Request('http://localhost/api/reactions', {
      method: 'POST',
      body: JSON.stringify({ postId: 1, emoji: '❤️' }),
    })
    const response = await POST(req)
    const data = await response.json()

    expect(prisma.reaction.create).toHaveBeenCalled()
    expect(data).toEqual([{ emoji: '❤️', _count: 1 }])
    // Should set session_id cookie
    const setCookie = response.headers.get('set-cookie')
    expect(setCookie).toContain('session_id')
  })

  it('reuses existing session cookie', async () => {
    const mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: 'existing-session-id' }),
    }
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

    vi.mocked(prisma.reaction.create).mockResolvedValue({} as any)
    vi.mocked(prisma.reaction.groupBy).mockResolvedValue([] as any)

    const req = new Request('http://localhost/api/reactions', {
      method: 'POST',
      body: JSON.stringify({ postId: 1, emoji: '🔥' }),
    })
    await POST(req)

    expect(prisma.reaction.create).toHaveBeenCalledWith({
      data: { postId: 1, emoji: '🔥', sessionId: 'existing-session-id' },
    })
  })

  it('silently ignores duplicate reactions', async () => {
    const mockCookieStore = {
      get: vi.fn().mockReturnValue({ value: 'session-1' }),
    }
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

    vi.mocked(prisma.reaction.create).mockRejectedValue(new Error('Unique constraint'))
    vi.mocked(prisma.reaction.groupBy).mockResolvedValue([
      { emoji: '❤️', _count: 1 },
    ] as any)

    const req = new Request('http://localhost/api/reactions', {
      method: 'POST',
      body: JSON.stringify({ postId: 1, emoji: '❤️' }),
    })
    const response = await POST(req)

    // Should not throw, should return reactions
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toEqual([{ emoji: '❤️', _count: 1 }])
  })
})
