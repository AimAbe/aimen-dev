'use client'
import { useState, useEffect } from 'react'
import PostEditor from '../../components/PostEditor'
import Layout from '@/app/components/Layout'

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

  if (!post) {
    return (
      <Layout>
        <p className="t-meta" style={{ padding: 'var(--s-6) 0' }}>
          <span className="t-prompt">…&nbsp;</span>loading post
        </p>
      </Layout>
    )
  }

  return <PostEditor mode="edit" initialForm={post} originalSlug={slug} />
}
