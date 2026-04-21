import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
    },
  },
}))

import { getAdjacentPosts } from '@/lib/getAdjacentPosts'
import { prisma } from '@/lib/db'

describe('getAdjacentPosts', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns prev and next posts for a middle post', async () => {
    const posts = [
      { slug: 'first', title: 'First' },
      { slug: 'second', title: 'Second' },
      { slug: 'third', title: 'Third' },
    ]
    vi.mocked(prisma.post.findMany).mockResolvedValue(posts as any)

    const result = await getAdjacentPosts('second')

    expect(result.prev).toEqual({ slug: 'first', title: 'First' })
    expect(result.next).toEqual({ slug: 'third', title: 'Third' })
  })

  it('returns null prev for the first post', async () => {
    const posts = [
      { slug: 'first', title: 'First' },
      { slug: 'second', title: 'Second' },
    ]
    vi.mocked(prisma.post.findMany).mockResolvedValue(posts as any)

    const result = await getAdjacentPosts('first')

    expect(result.prev).toBeNull()
    expect(result.next).toEqual({ slug: 'second', title: 'Second' })
  })

  it('returns null next for the last post', async () => {
    const posts = [
      { slug: 'first', title: 'First' },
      { slug: 'second', title: 'Second' },
    ]
    vi.mocked(prisma.post.findMany).mockResolvedValue(posts as any)

    const result = await getAdjacentPosts('second')

    expect(result.prev).toEqual({ slug: 'first', title: 'First' })
    expect(result.next).toBeNull()
  })

  it('returns both null for a single post', async () => {
    const posts = [{ slug: 'only', title: 'Only Post' }]
    vi.mocked(prisma.post.findMany).mockResolvedValue(posts as any)

    const result = await getAdjacentPosts('only')

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })

  it('returns both null when slug not found', async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([])

    const result = await getAdjacentPosts('nonexistent')

    expect(result.prev).toBeNull()
    expect(result.next).toBeNull()
  })
})
