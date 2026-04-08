import { prisma } from '@/lib/db'

export default async function CommentsDisplay({ slug }: { slug: string }) {
  const comments = await prisma.comment.findMany({
    where: {
      approved: true,
      post: { slug },
    },
    orderBy: { createdAt: 'asc' },
  })

  if (comments.length === 0) {
    return <p className="text-sm text-text-dim">No comments yet. Be the first.</p>
  }

  return (
    <ul className="space-y-6">
      {comments.map((c) => (
        <li key={c.id} className="bg-bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">{c.author}</span>
            <time className="text-xs font-mono text-text-dim">
              {new Date(c.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>
          <p className="text-sm text-text-muted leading-6">{c.body}</p>
        </li>
      ))}
    </ul>
  )
}
