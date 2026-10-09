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
    return <p className="comment-note">Comment submitted. It will appear after review.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        placeholder="Name"
        aria-label="Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        className="field"
      />
      <textarea
        placeholder="Your comment"
        aria-label="Your comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        className="field"
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
