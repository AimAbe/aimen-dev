'use client'

import { useState } from 'react'

export default function CommentForm({ slug }: { slug: string }) {
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, author, content }),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError('Failed to submit comment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <p className="text-sm text-text-muted mt-6">
        Comment submitted. It will appear after review.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h3 className="text-sm font-mono text-text-dim uppercase tracking-wider">Leave a comment</h3>
      <input
        type="text"
        placeholder="Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
      />
      <textarea
        placeholder="Your comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors resize-none"
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-bg font-mono text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
