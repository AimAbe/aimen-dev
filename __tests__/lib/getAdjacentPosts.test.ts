import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}))

import { getAdjacentPosts } from '@/lib/getAdjacentPosts'
import { prisma } from '@/lib/db'

const t = (offset = 0) => new Date(1_000_000 + offset)

describe('getAdjacentPosts', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns prev and next posts for a middle post', async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue({ createdAt: t(1) } as any)
    vi.mocked(prisma.post.findFirst)
      .mockResolvedValueOnce({ slug: 'first', title: 'First' } as any)
      .mockResolvedValueOnce({ slug: 'third', title: 'Third' } as any)

    const result = await getAdjacentPosts('second')

    expect(result.prev).toEqual({ slug: 'first', title: 'First' })
    expect(result.next).toEqual({ slug: 'third', title: 'Third' })
  })

  it('returns null prev for the first post', async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue({ createdAt: t(0) } as any)
    vi.mocked(prisma.post.findFirst)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ slug: 'second', title: 'Second' } as any)

    const result = await getAdjacentPosts('first')

    expect(result.prev).toBeNull()
    expect(result.next).toEqual({ slug: 'second', title: 'Second' })
  })

  it('returns null next for the last post', async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue({ createdAt: t(2) } as any)
    vi.mocked(prisma.post.findFirst)
      .mockResolvedValueOnce({ slug: 'first', title: 'First' } as any)
      .mockResolvedValueOnce(null)

    const result = await getAdjacentPosts('second')

    expect(result.prev).toEqual({ slug: 'first', title: 'First' })
    expect(result.next).toBeNull()
  })

  it('returns both null for a single post', async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue({ createdAt: t(0) } as any)
    vi.mocked(prisma.post.findFirst)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)

    const result = await getAdjacentPosts('only')

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })

  it('returns both null when slug not found', async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null)

    const result = await getAdjacentPosts('nonexistent')

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
    expect(prisma.post.findFirst).not.toHaveBeenCalled()
  })
})
