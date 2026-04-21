import { prisma } from '@/lib/db'

export async function getAdjacentPosts(currentSlug: string) {
  const current = await prisma.post.findUnique({
    where: { slug: currentSlug, published: true },
    select: { createdAt: true },
  })

  if (!current) return { prev: null, next: null }

  const [prev, next] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, createdAt: { lt: current.createdAt } },
      orderBy: { createdAt: 'desc' },
      select: { slug: true, title: true },
    }),
    prisma.post.findFirst({
      where: { published: true, createdAt: { gt: current.createdAt } },
      orderBy: { createdAt: 'asc' },
      select: { slug: true, title: true },
    }),
  ])

  return { prev, next }
}
