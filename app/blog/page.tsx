import Link from 'next/link'
import { prisma } from '@/lib/db'
import Layout from '@/app/components/Layout'
import Search from '@/app/components/Search'

export const revalidate = 60

function getTagClass(tag: string | null): string | null {
  if (!tag) return null
  const t = tag.toLowerCase()
  if (t.includes('build')) return 'tag-build'
  if (t.includes('deep')) return 'tag-deep'
  if (t.includes('career')) return 'tag-career'
  if (t.includes('full')) return 'tag-fullstack'
  return null
}

const TAG_STYLE = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '10px',
  padding: '2px 8px',
  borderRadius: '3px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
  })

  return (
    <Layout>
      <div style={{ padding: '60px 48px 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#89B4FA',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            // writing
          </p>
          <h1 style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 400,
            color: '#E8F0FE',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}>
            All Posts
          </h1>
          <Search />
        </div>

        {posts.length === 0 ? (
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#6C7393' }}>
            No posts yet. Check back soon.
          </p>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            background: '#313244',
            border: '1px solid #313244',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            {posts.map(post => {
              const tagClass = getTagClass(post.tag)
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      {post.tag && (
                        tagClass ? (
                          <span className={tagClass} style={TAG_STYLE}>{post.tag}</span>
                        ) : (
                          <span style={{ ...TAG_STYLE, background: 'rgba(137,180,250,0.12)', color: '#89B4FA' }}>
                            {post.tag}
                          </span>
                        )
                      )}
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        color: '#6C7393',
                      }}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#E8F0FE',
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {post.title}
                    </div>
                    {post.excerpt && (
                      <div style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: '13px',
                        fontWeight: 300,
                        color: '#6C7393',
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {post.excerpt}
                      </div>
                    )}
                  </div>
                  <span className="post-arrow">→</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
