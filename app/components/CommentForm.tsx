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
      setError('failed to submit. try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <p className="t-meta" style={{ marginTop: 'var(--s-5)' }}>
        <span className="t-prompt">$&nbsp;</span>echo "thanks" — comment queued for review.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="form" style={{ marginTop: 'var(--s-6)' }}>
      <p className="t-meta">
        <span className="t-prompt">$&nbsp;</span>leave a comment
      </p>
      <div>
        <label className="form-label" htmlFor="author">name</label>
        <input
          id="author"
          type="text"
          className="input"
          placeholder="who's writing"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="form-label" htmlFor="content">comment</label>
        <textarea
          id="content"
          className="input"
          placeholder="markdown ok"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          style={{ resize: 'vertical', minHeight: 120 }}
        />
      </div>
      {error && (
        <p className="t-meta" style={{ color: 'var(--err)' }}>
          <span className="t-prompt">!&nbsp;</span>{error}
        </p>
      )}
      <div>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? '[ submitting... ]' : '[ submit ]'}
        </button>
      </div>
    </form>
  )
}
