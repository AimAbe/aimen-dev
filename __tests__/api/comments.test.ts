import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    comment: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

import { GET, POST } from '@/app/api/comments/route'
import { prisma } from '@/lib/db'

describe('GET /api/comments', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 400 when slug is missing', async () => {
    const req = new Request('http://localhost/api/comments')
    const response = await GET(req)

    expect(response.status).toBe(400)
  })

  it('returns approved comments for a slug', async () => {
    const mockComments = [
      { id: 1, author: 'Alice', body: 'Great!', approved: true, createdAt: new Date() },
    ]
    vi.mocked(prisma.comment.findMany).mockResolvedValue(mockComments as any)

    const req = new Request('http://localhost/api/comments?slug=test-post')
    const response = await GET(req)
    const data = await response.json()

    expect(prisma.comment.findMany).toHaveBeenCalledWith({
      where: { approved: true, post: { slug: 'test-post' } },
      orderBy: { createdAt: 'asc' },
    })
    expect(data).toHaveLength(1)
    expect(data[0].author).toBe('Alice')
  })
})

describe('POST /api/comments', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 400 when fields are missing', async () => {
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify({ slug: 'test' }),
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('returns 400 when author is missing', async () => {
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify({ slug: 'test', content: 'Hello' }),
    })
    const response = await POST(req)

    expect(response.status).toBe(400)
  })

  it('creates a comment with approved=false', async () => {
    const created = { id: 1, author: 'Bob', body: 'Nice', approved: false }
    vi.mocked(prisma.comment.create).mockResolvedValue(created as any)

    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify({ slug: 'test', author: 'Bob', content: 'Nice' }),
    })
    const response = await POST(req)

    expect(response.status).toBe(201)
    expect(prisma.comment.create).toHaveBeenCalledWith({
      data: {
        author: 'Bob',
        body: 'Nice',
        approved: false,
        post: { connect: { slug: 'test' } },
      },
    })
  })
})
