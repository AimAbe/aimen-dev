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

  if (typeof slug !== 'string' || slug.length < 1 || slug.length > 100) {
    return new Response('Invalid slug', { status: 400 })
  }
  if (typeof author !== 'string' || author.length < 1 || author.length > 100) {
    return new Response('Invalid author', { status: 400 })
  }
  if (typeof content !== 'string' || content.length < 1 || content.length > 5000) {
    return new Response('Invalid content', { status: 400 })
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
