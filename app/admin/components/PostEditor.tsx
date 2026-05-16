'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/app/components/Layout'

type PostForm = {
  title: string
  slug: string
  excerpt: string
  tag: string
  content: string
  published: boolean
}

type Props = {
  initialForm?: PostForm
  originalSlug?: string
  mode: 'new' | 'edit'
}

const defaultForm: PostForm = {
  title: '', slug: '', excerpt: '', tag: '', content: '', published: false
}

export default function PostEditor({ initialForm = defaultForm, originalSlug = '', mode }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<PostForm>(initialForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    if (mode === 'new') {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setForm(f => ({ ...f, title, slug }))
    } else {
      setForm(f => ({ ...f, title }))
    }
  }

  const handleSubmit = async (published: boolean) => {
    setSaving(true)
    setError(null)
    try {
      const res = mode === 'new'
        ? await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, published })
          })
        : await fetch(`/api/posts/${originalSlug}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, published })
          })
      if (!res.ok) throw new Error()
      router.push('/admin')
    } catch {
      setError('failed to save. try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('delete this post? cannot be undone.')) return
    try {
      const res = await fetch(`/api/posts/${originalSlug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.push('/admin')
    } catch {
      setError('failed to delete. try again.')
    }
  }

  return (
    <Layout>
      <div className="admin-head">
        <div>
          <p className="t-meta">
            <span className="t-prompt">$&nbsp;</span>vim {form.slug ? `posts/${form.slug}.md` : 'posts/_new.md'}
          </p>
          <h1 className="t-h1" style={{ marginTop: 'var(--s-2)' }}>
            {mode === 'new' ? 'new post' : (form.title || 'edit post')}
          </h1>
        </div>
        <Link href="/admin" className="btn">[ ← back ]</Link>
      </div>

      <div className="form">
        <div className="form-row two">
          <div>
            <label className="form-label" htmlFor="title">title</label>
            <input
              id="title"
              className="input"
              placeholder="post title"
              value={form.title}
              onChange={handleTitleChange}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="slug">slug</label>
            <input
              id="slug"
              className="input"
              placeholder="post-slug"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            />
          </div>
        </div>

        <div className="form-row three-one">
          <div>
            <label className="form-label" htmlFor="excerpt">excerpt</label>
            <input
              id="excerpt"
              className="input"
              placeholder="short description shown on listing"
              value={form.excerpt ?? ''}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="tag">tag</label>
            <input
              id="tag"
              className="input"
              placeholder="build / deep / career / fullstack"
              value={form.tag ?? ''}
              onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="content">content (markdown)</label>
          <textarea
            id="content"
            className="input"
            placeholder="write in markdown..."
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            style={{ minHeight: 480, resize: 'vertical', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}
          />
        </div>

        {error && (
          <p className="t-meta" style={{ color: 'var(--err)' }}>
            <span className="t-prompt">!&nbsp;</span>{error}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--s-3)', flexWrap: 'wrap', marginTop: 'var(--s-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--s-2)' }}>
            <button onClick={() => handleSubmit(false)} disabled={saving} className="btn">
              {saving ? '[ saving... ]' : '[ save draft ]'}
            </button>
            <button onClick={() => handleSubmit(true)} disabled={saving} className="btn btn-primary">
              {saving ? '[ publishing... ]' : '[ publish ]'}
            </button>
          </div>
          {mode === 'edit' && (
            <button onClick={handleDelete} className="btn" style={{ color: 'var(--err)', borderColor: 'var(--err)' }}>
              [ delete post ]
            </button>
          )}
        </div>
      </div>
    </Layout>
  )
}
