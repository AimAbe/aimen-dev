import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'

// GET /api/posts - all published posts
export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
        slug: true,
        title: true,
        excerpt: true,
        tag: true
        createdAt: true,
    }    
  })
    return Response.json(posts)
}

// POST /api/posts — create a post (admin only)
export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const body = await req.json()
  const post = await prisma.post.create({ data: body })
  return Response.json(post)
}