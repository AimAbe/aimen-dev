'use client'
import { useState, useEffect } from 'react'
import PostEditor from '../../components/PostEditor'

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [post, setPost] = useState(null)
  const [slug, setSlug] = useState('')

  useEffect(() => {
    const load = async () => {
      const { slug } = await params
      setSlug(slug)
      const res = await fetch(`/api/posts/${slug}`)
      const data = await res.json()
      setPost(data)
    }
    load()
  }, [params])

  if (!post) return (
    <div className="min-h-screen bg-bg flex items-center justify-center font-mono text-xs text-text-muted">
      Loading...
    </div>
  )

  return <PostEditor mode="edit" initialForm={post} originalSlug={slug} />
}