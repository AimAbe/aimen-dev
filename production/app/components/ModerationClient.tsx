'use client'

import { useState } from 'react'

type Comment = { id: number; author: string; content: string; postSlug: string; createdAt: string }

function fmtDate(s: string) {
  return new Date(s).toISOString().slice(0, 10)
}

export default function ModerationClient({ initialComments }: { initialComments: Comment[] }) {
  const [comments, setComments] = useState(initialComments)

  async function approve(id: number) {
    await fetch(`/api/comments/${id}`, { method: 'PATCH' })
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  async function remove(id: number) {
    await fetch(`/api/comments/${id}`, { method: 'DELETE' })
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  if (comments.length === 0) {
    return (
      <p className="t-meta" style={{ padding: 'var(--s-5) 0' }}>
        <span className="t-prompt">$&nbsp;</span>queue empty. inbox zero.
      </p>
    )
  }

  return (
    <ul className="comments-list" style={{ borderTop: '1px dashed var(--border)' }}>
      {comments.map((c) => (
        <li key={c.id} className="comment" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--s-4)', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="comment-head">
              <span className="comment-author">{c.author}</span>
              <span className="t-meta">on /blog/{c.postSlug}</span>
              <span className="comment-date">{fmtDate(c.createdAt)}</span>
            </div>
            <p className="comment-body">{c.content}</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--s-2)', flexShrink: 0 }}>
            <button onClick={() => approve(c.id)} className="btn btn-primary">[ approve ]</button>
            <button onClick={() => remove(c.id)} className="btn">[ delete ]</button>
          </div>
        </li>
      ))}
    </ul>
  )
}
