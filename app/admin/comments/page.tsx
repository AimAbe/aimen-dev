import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import ModerationClient from '@/app/components/ModerationClient'

export default async function AdminCommentsPage() {
  const session = await auth()
  if (!session) redirect('/api/auth/signin')

  const pending = await prisma.comment.findMany({
    where: { approved: false },
    orderBy: { createdAt: 'desc' },
    include: { post: { select: { slug: true } } },
  })

  const comments = pending.map((comment) => ({
    id: comment.id,
    author: comment.author,
    content: comment.body,
    postSlug: comment.post.slug,
    createdAt: comment.createdAt.toISOString(),
  }))

  return (
    <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
      <h1 className="text-2xl font-bold mb-8">Comment Moderation</h1>
      <ModerationClient initialComments={comments} />
    </main>
  )
}
