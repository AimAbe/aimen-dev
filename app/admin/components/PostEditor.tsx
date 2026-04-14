'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle = {
  width: '100%',
  background: '#252D3D',
  border: '1px solid #313244',
  borderRadius: '3px',
  padding: '12px 16px',
  color: '#CDD6F4',
  fontFamily: 'Sora, sans-serif',
  fontSize: '14px',
  outline: 'none',
}

const labelStyle = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px',
  color: '#6C7393',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  marginBottom: '8px',
  display: 'block',
}

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
    if (mode === 'new') {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, published })
      })
    } else {
      await fetch(`/api/posts/${originalSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, published })
      })
    }
    setSaving(false)
    router.push('/admin')
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await fetch(`/api/posts/${originalSlug}`, { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#1E2430', color: '#CDD6F4', fontFamily: 'Sora, sans-serif', padding: '48px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #313244', paddingBottom: '24px' }}>
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#89B4FA', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
              // {mode === 'new' ? 'new post' : 'edit post'}
            </p>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '32px', fontWeight: 400 }}>
              {mode === 'new' ? 'Create Post' : (form.title || 'Edit Post')}
            </h1>
          </div>
          <a href="/admin" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6C7393', textDecoration: 'none' }}>← Back</a>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} placeholder="Post title" value={form.title} onChange={handleTitleChange} />
            </div>
            <div>
              <label style={labelStyle}>Slug</label>
              <input style={inputStyle} placeholder="post-slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Excerpt</label>
              <input style={inputStyle} placeholder="Short description shown on listing page" value={form.excerpt ?? ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Tag</label>
              <input style={inputStyle} placeholder="build log" value={form.tag ?? ''} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Content (Markdown)</label>
            <textarea
              style={{ ...inputStyle, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: '1.7', resize: 'vertical', minHeight: '480px' }}
              placeholder="Write in Markdown..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 24px', background: 'transparent', color: '#6C7393', border: '1px solid #313244', borderRadius: '3px', cursor: 'pointer' }}
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 24px', background: '#89B4FA', color: '#1E2430', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 500 }}
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>

            {mode === 'edit' && (
              <button
                onClick={handleDelete}
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 24px', background: 'transparent', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '3px', cursor: 'pointer' }}
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