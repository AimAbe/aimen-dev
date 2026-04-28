import Link from 'next/link'
import { prisma } from '@/lib/db'
import Layout from '@/app/components/Layout'
import Search from '@/app/components/Search'

export const revalidate = 60

function getTagClass(tag: string | null): string {
  if (!tag) return 'tag-build'
  const t = tag.toLowerCase()
  if (t.includes('build')) return 'tag-build'
  if (t.includes('deep')) return 'tag-deep'
  if (t.includes('career')) return 'tag-career'
  if (t.includes('full')) return 'tag-fullstack'
  return 'tag-build'
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
  })

  return (
    <Layout>
      {/* TWO-COLUMN LAYOUT */}
      <div className="r-two-col" style={{ minHeight: 'calc(100vh - 57px)' }}>
        {/* LEFT: Posts */}
        <div style={{ background: '#141010' }}>
          {/* Column header */}
          <div className="r-col-header">
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
              color: '#7A6F65', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              All Writing <span style={{ color: '#E8B84B', marginLeft: '8px' }}>{posts.length}</span>
            </span>
          </div>

          {/* Search */}
          <div className="r-search-bar">
            <Search />
          </div>

          {/* Post rows */}
          {posts.length === 0 ? (
            <div style={{ padding: '32px 24px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#7A6F65' }}>
              Nothing here yet. Check back soon.
            </div>
          ) : (
            posts.map((post) => {
              const d = new Date(post.createdAt)
              const month = d.toLocaleDateString('en-US', { month: 'short' })
              const day = d.getDate()
              const year = d.getFullYear()
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="post-row r-post-row"
                >
                  <div className="r-post-date" style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
                    color: '#7A6F65', lineHeight: 1.4,
                  }}>
                    {month} {day}<br />{year}
                  </div>
                  <div>
                    {post.tag && (
                      <span className={getTagClass(post.tag)} style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                        padding: '2px 8px', borderRadius: '3px',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        display: 'inline-block', marginBottom: '6px',
                      }}>
                        {post.tag}
                      </span>
                    )}
                    <div className="post-title" style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 500,
                      color: '#F7F3EE', lineHeight: 1.4,
                    }}>
                      {post.title}
                    </div>
                    {post.excerpt && (
                      <div style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 300,
                        color: '#7A6F65', marginTop: '4px',
                      }}>
                        {post.excerpt}
                      </div>
                    )}
                  </div>
                  <span className="post-arrow" style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#7A6F65',
                  }}>
                    →
                  </span>
                </Link>
              )
            })
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="r-sidebar" style={{ background: '#1C1818', padding: '24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
              color: '#E8B84B', letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              About
            </div>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: '15px',
              fontStyle: 'italic', color: '#7A6F65', lineHeight: 1.7, margin: 0,
            }}>
              &ldquo;Developer, builder, perpetual learner. Writing about things I&apos;m actively working through.&rdquo;
            </p>
          </div>

          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
              color: '#E8B84B', letterSpacing: '0.14em', textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Tags
            </div>
            {[
              { label: 'build log', cls: 'tag-build' },
              { label: 'deep dive', cls: 'tag-deep' },
              { label: 'career', cls: 'tag-career' },
              { label: 'fullstack', cls: 'tag-fullstack' },
            ].map(({ label, cls }) => (
              <span key={label} className={cls} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                padding: '3px 10px', borderRadius: '3px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                display: 'inline-block', margin: '0 6px 8px 0',
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
