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
    return (
      <div className="bg-bg-card border border-border p-10 text-center font-mono text-[13px] text-text-muted">
        No pending comments.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-px bg-border border border-border">
      {comments.map((c) => (
        <div key={c.id} className="bg-bg px-7 py-5 flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-[11px] text-accent">{c.author}</span>
              <span className="font-mono text-[10px] text-text-muted">on {c.postSlug}</span>
              <span className="font-mono text-[10px] text-text-muted">
                {new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-6">{c.content}</p>
          </div>
          <div className="flex gap-2 shrink-0 pt-1">
            <button
              onClick={() => approve(c.id)}
              className="font-mono text-[11px] tracking-[0.06em] uppercase px-4 py-2 bg-accent text-bg rounded cursor-pointer font-medium hover:opacity-90 transition-opacity"
            >
              Approve
            </button>
            <button
              onClick={() => remove(c.id)}
              className="font-mono text-[11px] tracking-[0.06em] uppercase px-4 py-2 bg-transparent text-text-muted border border-border rounded cursor-pointer hover:text-text hover:border-border-hover transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
