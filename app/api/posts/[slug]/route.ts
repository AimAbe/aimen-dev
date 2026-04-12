import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug }   // removed published: true so drafts load in editor
  })

  if (!post) return new Response('Not found', { status: 404 })
  return Response.json(post)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { slug } = await params
  const body = await req.json()
  const post = await prisma.post.update({ where: { slug }, data: body })
  
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  
  return Response.json(post)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const { slug } = await params
  await prisma.post.delete({ where: { slug } })
  
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  
  return new Response(null, { status: 204 })
}