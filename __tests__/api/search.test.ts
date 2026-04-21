import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
    },
  },
}))

import { GET } from '@/app/api/search/route'
import { prisma } from '@/lib/db'

describe('GET /api/search', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns empty array when query is missing', async () => {
    const req = new Request('http://localhost/api/search')
    const response = await GET(req)
    const data = await response.json()

    expect(data).toEqual([])
    expect(prisma.post.findMany).not.toHaveBeenCalled()
  })

  it('returns empty array when query is empty string', async () => {
    const req = new Request('http://localhost/api/search?q=')
    const response = await GET(req)
    const data = await response.json()

    expect(data).toEqual([])
  })

  it('returns empty array when query is whitespace', async () => {
    const req = new Request('http://localhost/api/search?q=%20%20')
    const response = await GET(req)
    const data = await response.json()

    expect(data).toEqual([])
  })

  it('searches published posts by title, excerpt, and content', async () => {
    const mockResults = [
      { slug: 'react-tips', title: 'React Tips', excerpt: 'Tips for React', tag: 'build' },
    ]
    vi.mocked(prisma.post.findMany).mockResolvedValue(mockResults as any)

    const req = new Request('http://localhost/api/search?q=react')
    const response = await GET(req)
    const data = await response.json()

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: {
        published: true,
        OR: [
          { title: { contains: 'react', mode: 'insensitive' } },
          { excerpt: { contains: 'react', mode: 'insensitive' } },
          { content: { contains: 'react', mode: 'insensitive' } },
        ],
      },
      select: { slug: true, title: true, excerpt: true, tag: true },
      take: 8,
    })
    expect(data).toEqual(mockResults)
  })

  it('limits results to 8', async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([] as any)

    const req = new Request('http://localhost/api/search?q=test')
    await GET(req)

    expect(vi.mocked(prisma.post.findMany).mock.calls[0][0]?.take).toBe(8)
  })
})
