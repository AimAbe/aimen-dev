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

  const totalPosts = await prisma.post.count({ where: { published: true } })

  return (
    <Layout>
      {/* INTRO STRIP */}
      <div className="r-intro">
        {/* Left */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%',
              background: '#E8B84B', animation: 'pulse 2.5s infinite',
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
              color: '#E8B84B', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              Hi, I&apos;m Aimen
            </span>
          </div>

          <h1 style={{ margin: '0 0 16px', lineHeight: 1.1 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 600, display: 'block' }}>
              I build things
            </span>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 400, fontStyle: 'italic', color: '#7A6F65', display: 'block',
            }}>
              for the web.
            </span>
          </h1>

          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 300,
            color: '#7A6F65', maxWidth: '480px', lineHeight: 1.7, margin: '0 0 28px',
          }}>
            Developer, tinkerer, and occasional writer. I document what I learn
            and build in public. This site is one of those projects.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/blog" style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.06em', padding: '10px 20px', borderRadius: '6px',
              background: '#E8B84B', color: '#141010', textDecoration: 'none',
              border: 'none', display: 'inline-block',
            }}>
              Read the blog
            </Link>
            <a href="https://github.com/AimAbe" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.06em', padding: '10px 20px', borderRadius: '6px',
              background: 'transparent', color: '#7A6F65', textDecoration: 'none',
              border: '1px solid #2A2420', display: 'inline-block',
            }}>
              GitHub
            </a>
          </div>
        </div>

        {/* Right: stats — hidden on mobile via r-intro-stats */}
        <div className="r-intro-stats" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 400, color: '#E8B84B', lineHeight: 1 }}>
              {totalPosts}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#7A6F65', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
              posts
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 400, color: '#E8B84B', lineHeight: 1 }}>
              3
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#7A6F65', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
              projects
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="r-two-col" style={{ minHeight: '400px' }}>
        {/* LEFT: Posts */}
        <div style={{ background: '#141010' }}>
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

        {/* RIGHT: Sidebar — hidden on mobile via r-sidebar */}
        <div className="r-sidebar" style={{ background: '#1C1818', padding: '24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#E8B84B', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
              About
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontStyle: 'italic', color: '#7A6F65', lineHeight: 1.7, margin: 0 }}>
              &ldquo;Developer, builder, perpetual learner. Writing about things I&apos;m actively working through — not the things I&apos;ve already mastered.&rdquo;
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: '#E8B84B', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Currently Learning
            </div>
            {['Go', 'Docker', 'AWS', 'CI/CD pipelines'].map(item => (
              <div key={item} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#7A6F65', marginBottom: '6px' }}>
                <span style={{ color: '#E8B84B', marginRight: '8px' }}>→</span>{item}
              </div>
            ))}
          </div>

          <div>
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
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </Layout>
  )
}
