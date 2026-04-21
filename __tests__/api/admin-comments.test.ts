import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    comment: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { GET } from '@/app/api/admin/comments/route'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

describe('GET /api/admin/comments', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const response = await GET()
    expect(response.status).toBe(401)
  })

  it('returns unapproved comments with post slug', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as any)
    const mockComments = [
      {
        id: 1,
        author: 'Alice',
        body: 'Pending comment',
        approved: false,
        createdAt: new Date('2025-01-01'),
        post: { slug: 'test-post' },
      },
    ]
    vi.mocked(prisma.comment.findMany).mockResolvedValue(mockComments as any)

    const response = await GET()
    const data = await response.json()

    expect(prisma.comment.findMany).toHaveBeenCalledWith({
      where: { approved: false },
      orderBy: { createdAt: 'desc' },
      include: { post: { select: { slug: true } } },
    })
    expect(data).toEqual([
      {
        id: 1,
        author: 'Alice',
        content: 'Pending comment',
        postSlug: 'test-post',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    ])
  })

  it('returns empty array when no pending comments', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as any)
    vi.mocked(prisma.comment.findMany).mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(data).toEqual([])
  })
})
