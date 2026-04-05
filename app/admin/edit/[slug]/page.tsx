'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', tag: '', content: '', published: false
  })
  const [loading, setLoading] = useState(true)
  const [originalSlug, setOriginalSlug] = useState('')

  useEffect(() => {
    const load = async () => {
      const { slug } = await params
      setOriginalSlug(slug)
      const res = await fetch(`/api/posts/${slug}`)
      const post = await res.json()
      setForm(post)
      setLoading(false)
    }
    load()
  }, [params])

  const handleSubmit = async (published: boolean) => {
    await fetch(`/api/posts/${originalSlug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, published })
    })
    router.push('/admin')
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await fetch(`/api/posts/${originalSlug}`, { method: 'DELETE' })
    router.push('/admin')
  }

  if (loading) return <p>Loading...</p>

  return (
    <main>
      <h1>Edit Post</h1>
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
      />
      <input
        placeholder="Slug"
        value={form.slug}
        onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
      />
      <input
        placeholder="Excerpt"
        value={form.excerpt ?? ''}
        onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
      />
      <input
        placeholder="Tag"
        value={form.tag ?? ''}
        onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
      />
      <textarea
        placeholder="Content (Markdown)"
        value={form.content}
        onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
        rows={20}
      />
      <button onClick={() => handleSubmit(false)}>Save Draft</button>
      <button onClick={() => handleSubmit(true)}>Publish</button>
      <button onClick={handleDelete}>Delete</button>
    </main>
  )
}