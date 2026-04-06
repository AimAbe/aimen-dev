import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      tag: true,
      createdAt: true,
    }
  })
  return Response.json(posts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const post = await prisma.post.create({ data: body })
  return Response.json(post)
}