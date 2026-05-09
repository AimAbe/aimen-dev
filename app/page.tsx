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

const STACK = ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind', 'Python', 'Docker', 'Vercel', 'React', 'Node.js']

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
  })

  const featured = posts[0] ?? null
  const rest = posts.slice(1)
  const stackItems = [...STACK, ...STACK]

  return (
    <Layout>

      {/* HERO */}
      <section className="bg-grid" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="r-post-content" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <p className="fade-1" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#89B4FA',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span className="status-dot" />
            available for work
          </p>
          <h1 className="fade-2" style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: '#E8F0FE',
            margin: '0 0 24px',
          }}>
            aimen aberra
          </h1>
          <p className="fade-3" style={{
            fontSize: '18px',
            fontWeight: 300,
            color: '#6C7393',
            lineHeight: 1.7,
            margin: '0 0 40px',
            maxWidth: '480px',
          }}>
            full-stack developer. i write about building products, learning in public, and thinking through hard problems.
          </p>
          <div className="fade-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/blog" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '12px 28px',
              background: '#89B4FA',
              color: '#1E2430',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 500,
            }}>
              read the blog →
            </Link>
            <a href="https://github.com/AimAbe" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '12px 28px',
              background: 'transparent',
              color: '#6C7393',
              border: '1px solid #313244',
              borderRadius: '6px',
              textDecoration: 'none',
            }}>
              github
            </a>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{
        borderTop: '1px solid #313244',
        borderBottom: '1px solid #313244',
        padding: '14px 0',
        overflow: 'hidden',
      }}>
        <div className="ticker-track">
          {stackItems.map((item, i) => (
            <span key={i} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#6C7393',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}>
              {item}
              <span style={{ color: '#313244', margin: '0 16px' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT STRIP */}
      <div style={{ borderBottom: '1px solid #313244', padding: '60px 0' }}>
        <div className="r-post-content" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '48px',
          }}>
            <div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: '#89B4FA',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                // about
              </p>
              <p style={{
                fontSize: '15px',
                fontWeight: 300,
                color: '#8A94B0',
                lineHeight: 1.8,
                margin: 0,
              }}>
                i&apos;m a self-taught developer focused on building clean, useful things. currently working on full-stack web projects and writing about what i learn along the way.
              </p>
            </div>
            <div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: '#89B4FA',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                // currently learning
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['systems design', 'distributed systems', 'rust', 'ML fundamentals'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '4px', height: '4px', borderRadius: '50%',
                      background: '#89B4FA', flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      color: '#6C7393',
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* POSTS SECTION */}
      {posts.length > 0 && (
        <div style={{ padding: '60px 0 80px' }}>
          <div className="r-post-content" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              color: '#89B4FA',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}>
              // recent posts
            </p>

            <div className="posts-grid">

              {/* Featured post — spans 2 columns */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="post-card-hover post-featured" style={{
                  padding: '28px',
                  border: '1px solid #313244',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}>
                  <span className="card-line" />
                  {featured.tag && (
                    <span className={getTagClass(featured.tag)} style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                      padding: '2px 8px', borderRadius: '3px',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      display: 'inline-block', marginBottom: '16px',
                    }}>
                      {featured.tag}
                    </span>
                  )}
                  <h2 style={{
                    fontFamily: "'Lora', serif",
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#E8F0FE',
                    lineHeight: 1.3,
                    marginBottom: '12px',
                  }}>
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p style={{
                      fontSize: '14px',
                      fontWeight: 300,
                      color: '#6C7393',
                      lineHeight: 1.7,
                      marginBottom: '20px',
                    }}>
                      {featured.excerpt}
                    </p>
                  )}
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#89B4FA',
                  }}>
                    read more <span className="card-arrow">→</span>
                  </span>
                </Link>
              )}

              {/* Rest of posts */}
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card-hover" style={{
                  padding: '24px',
                  border: '1px solid #313244',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}>
                  <span className="card-line" />
                  {post.tag && (
                    <span className={getTagClass(post.tag)} style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                      padding: '2px 8px', borderRadius: '3px',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      display: 'inline-block', marginBottom: '12px',
                    }}>
                      {post.tag}
                    </span>
                  )}
                  <h3 style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#E8F0FE',
                    lineHeight: 1.4,
                    marginBottom: '8px',
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#6C7393',
                    margin: 0,
                  }}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </Link>
              ))}
            </div>

            {posts.length >= 6 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link href="/blog" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  color: '#6C7393',
                  textDecoration: 'none',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  view all posts →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </Layout>
  )
}
