import Link from 'next/link'
import { prisma } from '@/lib/db'
import Layout from '@/app/components/Layout'

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'build log': { bg: 'rgba(200,255,87,0.1)', color: '#c8ff57' },
  'deep dive': { bg: 'rgba(87,200,255,0.1)', color: '#57c8ff' },
  'career':    { bg: 'rgba(255,107,107,0.1)', color: '#ff6b6b' },
}

function tagStyle(tag: string | null) {
  const t = tag?.toLowerCase() ?? ''
  return TAG_COLORS[t] ?? { bg: 'rgba(107,104,128,0.15)', color: '#6b6880' }
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true }
  })

  return (
    <Layout>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 48px' }}>

        {/* Header */}
        <div style={{ marginBottom: '56px', paddingBottom: '24px', borderBottom: '1px solid #1e1e2a' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '11px',
            color: '#c8ff57', letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            // writing
          </p>
          <h1 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '48px', fontWeight: 400, lineHeight: 1 }}>
            All posts
          </h1>
        </div>

        {/* Post list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#1e1e2a', border: '1px solid #1e1e2a' }}>
          {posts.map(post => {
            const { bg, color } = tagStyle(post.tag)
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="post-card" style={{
                  background: '#0c0c0f',
                  padding: '28px 32px',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {post.tag && (
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                        padding: '3px 8px', borderRadius: '2px',
                        background: bg, color, letterSpacing: '0.08em', textTransform: 'uppercase'
                      }}>
                        {post.tag}
                      </span>
                    )}
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6b6880' }}>
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 style={{
                    fontFamily: 'Instrument Serif, serif', fontSize: '22px',
                    fontWeight: 400, color: '#e8e6f0', marginBottom: '10px', lineHeight: 1.3
                  }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p style={{ fontSize: '14px', color: '#6b6880', fontWeight: 300, lineHeight: 1.65 }}>
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </Layout>
  )
}