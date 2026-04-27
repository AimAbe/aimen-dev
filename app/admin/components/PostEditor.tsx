'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

const inputClass = 'w-full bg-bg-card border border-border rounded px-4 py-3 text-text font-sans text-sm outline-none focus:border-accent transition-colors'
const labelClass = 'font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2 block'

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
      if (!res.ok) throw new Error('Failed to save post')
      router.push('/admin')
    } catch {
      setError('Failed to save post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/posts/${originalSlug}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      router.push('/admin')
    } catch {
      setError('Failed to delete post. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-bg text-text font-sans p-12">
      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-border pb-6">
          <div>
            <p className="font-mono text-[11px] text-accent tracking-[0.15em] uppercase mb-2">
              // {mode === 'new' ? 'new post' : 'edit post'}
            </p>
            <h1 className="font-serif text-[32px] font-normal">
              {mode === 'new' ? 'Create Post' : (form.title || 'Edit Post')}
            </h1>
          </div>
          <a href="/admin" className="font-mono text-[11px] text-text-muted no-underline hover:text-text transition-colors">← Back</a>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-6">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input className={inputClass} placeholder="Post title" value={form.title} onChange={handleTitleChange} />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input className={inputClass} placeholder="post-slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-[3fr_1fr] gap-4">
            <div>
              <label className={labelClass}>Excerpt</label>
              <input className={inputClass} placeholder="Short description shown on listing page" value={form.excerpt ?? ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div>
              <label className={labelClass}>Tag</label>
              <input className={inputClass} placeholder="build log" value={form.tag ?? ''} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Content (Markdown)</label>
            <textarea
              className={`${inputClass} font-mono text-[13px] leading-[1.7] resize-y min-h-[480px]`}
              placeholder="Write in Markdown..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400">{error}</p>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="font-mono text-xs tracking-[0.08em] uppercase px-6 py-3 bg-transparent text-text-muted border border-border rounded cursor-pointer hover:text-text hover:border-border-hover transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="font-mono text-xs tracking-[0.08em] uppercase px-6 py-3 bg-accent text-bg border-none rounded cursor-pointer font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>

            {mode === 'edit' && (
              <button
                onClick={handleDelete}
                className="font-mono text-xs tracking-[0.08em] uppercase px-6 py-3 bg-transparent text-red-400 border border-red-400/30 rounded cursor-pointer hover:border-red-400/60 transition-colors"
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
