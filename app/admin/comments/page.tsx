import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import ModerationClient from '@/app/components/ModerationClient'
import Link from 'next/link'
import Layout from '@/app/components/Layout'

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
    <Layout>
      <div className="admin-head">
        <div>
          <p className="t-meta">
            <span className="t-prompt">$&nbsp;</span>cd ~/aimen.dev/admin/moderation
          </p>
          <h1 className="t-h1" style={{ marginTop: 'var(--s-2)' }}>moderation</h1>
        </div>
        <Link href="/admin" className="btn">[ ← admin ]</Link>
      </div>

      <p className="t-meta" style={{ marginBottom: 'var(--s-4)' }}>
        <span className="t-prompt">$&nbsp;</span>find ./comments -unapproved | wc -l
        <span className="t-mute2"> · </span>
        {comments.length}
      </p>

      <ModerationClient initialComments={comments} />

      <hr className="hr-rule" />

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
        <Link href="/" className="t-link t-mute" style={{ fontSize: 'var(--fs-sm)' }}>
          <span className="t-prompt">$&nbsp;</span>cd /
        </Link>
        <Link href="/api/auth/signout" className="t-link t-mute" style={{ fontSize: 'var(--fs-sm)' }}>
          sign out
        </Link>
      </div>
    </Layout>
  )
}
