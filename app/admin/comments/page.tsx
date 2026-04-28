import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import ModerationClient from '@/app/components/ModerationClient'
import Link from 'next/link'

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
    <main className="min-h-screen bg-bg text-text font-sans p-12">
      <div className="max-w-[860px] mx-auto">

        <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
          <div>
            <p className="font-mono text-[11px] text-accent tracking-[0.15em] uppercase mb-2">// admin · moderation</p>
            <h1 className="font-serif text-[36px] font-normal">Comments</h1>
          </div>
          <Link href="/admin" className="font-mono text-[11px] text-text-muted no-underline hover:text-text transition-colors">
            ← Back to dashboard
          </Link>
        </div>

        <div className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-6">
          Pending review — {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </div>

        <ModerationClient initialComments={comments} />

        <div className="mt-10 flex justify-between items-center border-t border-border pt-6">
          <Link href="/" className="font-mono text-[11px] text-text-muted no-underline hover:text-text transition-colors">← View site</Link>
          <Link href="/api/auth/signout" className="font-mono text-[11px] text-text-muted no-underline hover:text-text transition-colors">Sign out</Link>
        </div>

      </div>
    </main>
  )
}
