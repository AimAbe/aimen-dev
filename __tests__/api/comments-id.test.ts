import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    comment: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

import { PATCH, DELETE } from '@/app/api/comments/[id]/route'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

const makeContext = (id: string) => ({ params: Promise.resolve({ id }) })

describe('PATCH /api/comments/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const req = new Request('http://localhost/api/comments/1', { method: 'PATCH' })
    const response = await PATCH(req, makeContext('1'))

    expect(response.status).toBe(401)
  })

  it('approves a comment', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as any)
    const approved = { id: 1, approved: true }
    vi.mocked(prisma.comment.update).mockResolvedValue(approved as any)

    const req = new Request('http://localhost/api/comments/1', { method: 'PATCH' })
    const response = await PATCH(req, makeContext('1'))
    const data = await response.json()

    expect(prisma.comment.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { approved: true },
    })
    expect(data.approved).toBe(true)
  })
})

describe('DELETE /api/comments/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue(null)

    const req = new Request('http://localhost/api/comments/1', { method: 'DELETE' })
    const response = await DELETE(req, makeContext('1'))

    expect(response.status).toBe(401)
  })

  it('deletes a comment and returns 204', async () => {
    vi.mocked(auth).mockResolvedValue({ user: {} } as any)
    vi.mocked(prisma.comment.delete).mockResolvedValue({} as any)

    const req = new Request('http://localhost/api/comments/1', { method: 'DELETE' })
    const response = await DELETE(req, makeContext('1'))

    expect(response.status).toBe(204)
    expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: 1 } })
  })
})
