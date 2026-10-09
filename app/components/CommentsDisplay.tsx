import { prisma } from '@/lib/db'

export default async function CommentsDisplay({ slug }: { slug: string }) {
  const comments = await prisma.comment.findMany({
    where: { approved: true, post: { slug } },
    orderBy: { createdAt: 'asc' },
  })

  if (comments.length === 0) {
    return <p className="comment-note">No comments yet. Be the first.</p>
  }

  return (
    <ul className="comment-list">
      {comments.map((c) => (
        <li key={c.id}>
          <div className="comment-head">
            <span className="comment-author">{c.author}</span>
            <time className="comment-date">
              {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
          <p className="comment-body">{c.body}</p>
        </li>
      ))}
    </ul>
  )
}
