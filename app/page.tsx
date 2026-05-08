import Link from 'next/link'
import { prisma } from '@/lib/db'
import Layout from '@/app/components/Layout'

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

export default async function HomePage() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
  })

  return (
    <Layout>
      {/* POSTS */}
      <div style={{ background: '#141010', borderBottom: '1px solid #2A2420' }}>
        <div className="r-col-header">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#7A6F65', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Recent Writing
          </span>
          <Link href="/blog" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#E8B84B', textDecoration: 'none' }}>
            all posts →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div style={{ padding: '32px 24px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#7A6F65' }}>
            No posts yet. Check back soon.
          </div>
        ) : (
          recentPosts.map((post) => {
            const d = new Date(post.createdAt)
            const month = d.toLocaleDateString('en-US', { month: 'short' })
            const day = d.getDate()
            const year = d.getFullYear()
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-row r-post-row">
                <div className="r-post-date" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7A6F65' }}>
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
                  <div className="post-title" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 500, color: '#F7F3EE', lineHeight: 1.4 }}>
                    {post.title}
                  </div>
                  {post.excerpt && (
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 300, color: '#7A6F65', marginTop: '4px' }}>
                      {post.excerpt}
                    </div>
                  )}
                </div>
                <span className="post-arrow" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#7A6F65' }}>
                  →
                </span>
              </Link>
            )
          })
        )}
      </div>

      {/* ABOUT / LEARNING / BUILT WITH */}
      <div className="r-info-strip">
        <div className="r-info-section">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#E8B84B', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
            About
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontStyle: 'italic', color: '#7A6F65', lineHeight: 1.7, margin: 0 }}>
            &ldquo;Developer, builder, perpetual learner. Writing about things I&apos;m actively working through — not the things I&apos;ve already mastered.&rdquo;
          </p>
        </div>

        <div className="r-info-section">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#E8B84B', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Currently Learning
          </div>
          {['Go', 'Docker', 'AWS', 'CI/CD pipelines'].map(item => (
            <div key={item} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#7A6F65', marginBottom: '6px' }}>
              <span style={{ color: '#E8B84B', marginRight: '8px' }}>→</span>{item}
            </div>
          ))}
        </div>

        <div className="r-info-section">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#E8B84B', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Built With
          </div>
          {['Next.js 16', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS v4', 'Vercel'].map(item => (
            <div key={item} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#7A6F65', marginBottom: '6px' }}>
              <span style={{ color: '#E8B84B', marginRight: '8px' }}>→</span>{item}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
