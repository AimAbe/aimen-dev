'use client'

import { useState } from 'react'

type Comment = { id: number; author: string; content: string; postSlug: string; createdAt: string }

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
    return <p className="text-text-muted text-sm">No pending comments.</p>
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c.id} className="bg-bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold mb-1">
                {c.author} on <span className="text-accent">{c.postSlug}</span>
              </p>
              <p className="text-sm text-text-muted">{c.content}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => approve(c.id)}
                className="text-xs bg-accent text-bg font-mono font-semibold px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
              >
                Approve
              </button>
              <button
                onClick={() => remove(c.id)}
                className="text-xs border border-border text-text-muted font-mono px-3 py-1.5 rounded-md hover:border-border-hover hover:text-text transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
