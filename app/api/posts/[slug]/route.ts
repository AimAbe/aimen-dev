import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { validateOrigin } from '@/lib/csrf'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug }   // removed published: true so drafts load in editor
  })

  if (!post) return new Response('Not found', { status: 404 })

  if (!post.published) {
    const session = await auth()
    if (!session) return new Response('Not found', { status: 404 })
  }

  return Response.json(post)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!validateOrigin(req)) return new Response('Forbidden', { status: 403 })

  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { slug } = await params
  const body = await req.json()
  const { title, slug: newSlug, excerpt, tag, content, published } = body

  const data: Record<string, unknown> = {}
  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) return new Response('Invalid title', { status: 400 })
    data.title = title.trim()
  }
  if (newSlug !== undefined) {
    if (typeof newSlug !== 'string' || !newSlug.trim()) return new Response('Invalid slug', { status: 400 })
    data.slug = newSlug.trim()
  }
  if (content !== undefined) {
    if (typeof content !== 'string') return new Response('Invalid content', { status: 400 })
    data.content = content
  }
  if (excerpt !== undefined) data.excerpt = typeof excerpt === 'string' ? excerpt.trim() : null
  if (tag !== undefined) data.tag = typeof tag === 'string' ? tag.trim() : null
  if (published !== undefined) data.published = published === true

  const post = await prisma.post.update({ where: { slug }, data })
  
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  
  return Response.json(post)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!validateOrigin(req)) return new Response('Forbidden', { status: 403 })

  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { slug } = await params
  await prisma.post.delete({ where: { slug } })
  
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  
  return new Response(null, { status: 204 })
}