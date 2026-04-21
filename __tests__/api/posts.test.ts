import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock dependencies
vi.mock('@/lib/db', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { GET, POST } from '@/app/api/posts/route'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

describe('GET /api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns published posts ordered by createdAt desc', async () => {
    const mockPosts = [
      { slug: 'post-2', title: 'Post 2', excerpt: 'Excerpt 2', tag: 'build', createdAt: new Date() },
      { slug: 'post-1', title: 'Post 1', excerpt: 'Excerpt 1', tag: 'deep', createdAt: new Date() },
    ]
    vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts as any)

    const response = await GET()
    const data = await response.json()

    expect(prisma.post.findMany).toHaveBeenCalledWith({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
    })
    expect(data).toHaveLength(2)
    expect(data[0].slug).toBe('post-2')
    expect(data[1].slug).toBe('post-1')
  })

  it('returns empty array when no posts exist', async () => {
    vi.mocked(prisma.post.findMany).mockResolvedValue([])

    const response = await GET()
    const data = await response.json()

    expect(data).toEqual([])
  })
})

describe('POST /api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const req = new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test', slug: 'test', content: 'Content' }),
    })

    const response = await POST(req)
    expect(response.status).toBe(401)
  })

  it('creates a post when authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ user: { email: 'admin@test.com' } } as any)
    const postData = { title: 'New Post', slug: 'new-post', content: 'Hello world' }
    vi.mocked(prisma.post.create).mockResolvedValue({ id: 1, ...postData } as any)

    const req = new Request('http://localhost/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    })

    const response = await POST(req)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(prisma.post.create).toHaveBeenCalledWith({ data: postData })
    expect(data.slug).toBe('new-post')
  })
})
