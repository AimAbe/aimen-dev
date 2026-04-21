import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

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
  const { title, slug, excerpt, tag, content, published } = body

  if (!title || typeof title !== 'string') return new Response('Invalid title', { status: 400 })
  if (!slug || typeof slug !== 'string') return new Response('Invalid slug', { status: 400 })
  if (!content || typeof content !== 'string') return new Response('Invalid content', { status: 400 })

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: typeof excerpt === 'string' ? excerpt.trim() : null,
      tag: typeof tag === 'string' ? tag.trim() : null,
      content,
      published: published === true,
    }
  })

  revalidatePath('/')
  revalidatePath('/blog')

  return Response.json(post)
}