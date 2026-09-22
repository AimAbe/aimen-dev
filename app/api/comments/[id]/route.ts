import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { validateOrigin } from '@/lib/csrf'

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!validateOrigin(req)) return new Response('Forbidden', { status: 403 })

  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { id } = await context.params
  const comment = await prisma.comment.update({
    where: { id: Number(id) },
    data: { approved: true },
  })
  return Response.json(comment)
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  if (!validateOrigin(req)) return new Response('Forbidden', { status: 403 })

  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { id } = await context.params
  await prisma.comment.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}
