import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    post: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { GET, PATCH, DELETE } from '@/app/api/posts/[slug]/route'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const makeParams = (slug: string) => ({ params: Promise.resolve({ slug }) })

describe('GET /api/posts/[slug]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns a post by slug', async () => {
    const mockPost = { id: 1, slug: 'test-post', title: 'Test', content: 'Body' }
    vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any)

    const req = new Request('http://localhost/api/posts/test-post')
    const response = await GET(req, makeParams('test-post'))
    const data = await response.json()

    expect(prisma.post.findUnique).toHaveBeenCalledWith({ where: { slug: 'test-post' } })
    expect(data.slug).toBe('test-post')
  })

  it('returns 404 for non-existent slug', async () => {
    vi.mocked(prisma.post.findUnique).mockResolvedValue(null)

    const req = new Request('http://localhost/api/posts/nope')
    const response = await GET(req, makeParams('nope'))

    expect(response.status).toBe(404)
  })
})

describe('PATCH /api/posts/[slug]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const req = new Request('http://localhost/api/posts/test', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    })
    const response = await PATCH(req, makeParams('test'))

    expect(response.status).toBe(401)
  })

  it('updates a post and revalidates paths', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as any)
    const updated = { id: 1, slug: 'test', title: 'Updated' }
    vi.mocked(prisma.post.update).mockResolvedValue(updated as any)

    const req = new Request('http://localhost/api/posts/test', {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    })
    const response = await PATCH(req, makeParams('test'))
    const data = await response.json()

    expect(data.title).toBe('Updated')
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/blog')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/test')
  })
})

describe('DELETE /api/posts/[slug]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const req = new Request('http://localhost/api/posts/test', { method: 'DELETE' })
    const response = await DELETE(req, makeParams('test'))

    expect(response.status).toBe(401)
  })

  it('deletes a post and returns 204', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as any)
    vi.mocked(prisma.post.delete).mockResolvedValue({} as any)

    const req = new Request('http://localhost/api/posts/test', { method: 'DELETE' })
    const response = await DELETE(req, makeParams('test'))

    expect(response.status).toBe(204)
    expect(prisma.post.delete).toHaveBeenCalledWith({ where: { slug: 'test' } })
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/blog')
    expect(revalidatePath).toHaveBeenCalledWith('/blog/test')
  })
})
