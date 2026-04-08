import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) return new Response('Missing slug', { status: 400 })

  const comments = await prisma.comment.findMany({
    where: {
      approved: true,
      post: { slug },
    },
    orderBy: { createdAt: 'asc' },
  })

  return Response.json(comments)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { slug, author, content } = body

  if (!slug || !author || !content) {
    return new Response('Missing fields', { status: 400 })
  }

  const comment = await prisma.comment.create({
    data: {
      author,
      body: content,
      approved: false,
      post: {
        connect: { slug },
      },
    },
  })

  return Response.json(comment, { status: 201 })
}
