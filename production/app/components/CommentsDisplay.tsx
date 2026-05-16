import { prisma } from '@/lib/db'

function fmtDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10)
}

export default async function CommentsDisplay({ slug }: { slug: string }) {
  const comments = await prisma.comment.findMany({
    where: {
      approved: true,
      post: { slug },
    },
    orderBy: { createdAt: 'asc' },
  })

  if (comments.length === 0) {
    return (
      <p className="t-meta">
        <span className="t-prompt">$&nbsp;</span>ls comments/ — no comments yet. be the first.
      </p>
    )
  }

  return (
    <ul className="comments-list">
      {comments.map((c) => (
        <li key={c.id} className="comment">
          <div className="comment-head">
            <span className="comment-author">{c.author}</span>
            <span className="comment-date">{fmtDate(c.createdAt)}</span>
          </div>
          <p className="comment-body">{c.body}</p>
        </li>
      ))}
    </ul>
  )
}
