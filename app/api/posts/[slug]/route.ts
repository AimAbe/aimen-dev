import { prisma } from '@/lib/db'

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true }
  })

  if (!post) return new Response('Not found', { status: 404 })
  return Response.json(post)
}