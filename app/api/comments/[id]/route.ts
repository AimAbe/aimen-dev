import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { id } = await context.params
  const comment = await prisma.comment.update({
    where: { id: Number(id) },
    data: { approved: true },
  })
  return Response.json(comment)
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { id } = await context.params
  await prisma.comment.delete({ where: { id: Number(id) } })
  return new Response(null, { status: 204 })
}
