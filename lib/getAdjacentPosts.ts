import { prisma } from '@/lib/db'

export async function getAdjacentPosts(currentSlug: string) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'asc' },
    select: { slug: true, title: true },
  })

  const index = posts.findIndex((p) => p.slug === currentSlug)

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  }
}
