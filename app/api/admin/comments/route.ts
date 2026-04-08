import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const comments = await prisma.comment.findMany({
    where: { approved: false },
    orderBy: { createdAt: 'desc' },
    include: { post: { select: { slug: true } } },
  })

  return Response.json(
    comments.map((comment) => ({
      id: comment.id,
      author: comment.author,
      content: comment.body,
      postSlug: comment.post.slug,
      createdAt: comment.createdAt,
    }))
  )
}
