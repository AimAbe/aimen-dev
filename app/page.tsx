import Link from 'next/link'
import { prisma } from '@/lib/db'
import Layout from '@/app/components/Layout'

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

export default async function HomePage() {
  const [posts, postCount] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
    }),
    prisma.post.count({ where: { published: true } }),
  ])

  return (
    <Layout>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 48px 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          right: '-100px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(137,180,250,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div className="fade-1" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            color: '#89B4FA',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}>
            <div className="eyebrow-dot" />
            Hi, I&apos;m Aimen
          </div>

          {/* H1 */}
          <h1 className="fade-2" style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 'clamp(44px, 7vw, 80px)',
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}>
            <span style={{ color: '#E8F0FE', display: 'block' }}>I build things</span>
            <span style={{
              fontFamily: "'Lora', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#6C7393',
              display: 'block',
            }}>
              for the <span style={{ color: '#89B4FA' }}>web.</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="fade-3" style={{
            fontSize: '16px',
            fontWeight: 300,
            color: '#6C7393',
            lineHeight: 1.7,
            maxWidth: '480px',
            marginBottom: '40px',
          }}>
            Developer, tinkerer, and occasional writer. I document what I learn and build
            in public. This site is one of those projects.
          </p>

          {/* CTAs */}
          <div className="fade-4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/blog" className="btn-primary">Read the blog →</Link>
            <a href="https://github.com/AimAbe" className="btn-ghost">GitHub</a>
          </div>
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderTop: '1px solid #313244',
        borderBottom: '1px solid #313244',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left — who */}
        <div style={{ padding: '48px', borderRight: '1px solid #313244' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: '#89B4FA',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '16px',
          }}>
            who
          </p>
          <p style={{
            fontFamily: "'Lora', serif",
            fontSize: '20px',
            lineHeight: 1.6,
            color: '#E8F0FE',
          }}>
            Developer, builder, perpetual learner. I write about things I&apos;m actively
            working through —{' '}
            <em style={{ color: '#6C7393' }}>not the things I&apos;ve already mastered.</em>
          </p>
        </div>

        {/* Right — stack */}
        <div style={{ padding: '48px', background: '#252D3D' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10px',
            color: '#89B4FA',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            marginBottom: '16px',
          }}>
            stack
          </p>
          <p style={{ fontSize: '15px', fontWeight: 300, color: '#6C7393', marginBottom: '20px' }}>
            Currently building with:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind', 'Vercel', 'Terraform', 'Kubernetes'].map(t => (
              <span key={t} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(137,180,250,0.08)',
                color: '#89B4FA',
                border: '1px solid rgba(137,180,250,0.15)',
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── POSTS SECTION ── */}
      {posts.length > 0 && (
        <section style={{ padding: '72px 48px', position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '1px solid #313244',
          }}>
            <span style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#6C7393',
            }}>
              Recent Writing
            </span>
            <a href="/blog" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#89B4FA',
              textDecoration: 'none',
            }}>
              All posts →
            </a>
          </div>

          {/* Post list */}
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
                    {/* Meta row */}
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
                    {/* Title */}
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
                    {/* Excerpt */}
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
        </section>
      )}

      {/* ── TERMINAL ── */}
      <section style={{ padding: '0 48px 72px', position: 'relative', zIndex: 1 }}>
        <div style={{
          background: '#141820',
          border: '1px solid #313244',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {/* Terminal bar */}
          <div style={{
            background: '#252D3D',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderBottom: '1px solid #313244',
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F38BA8', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F9E2AF', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#A6E3A1', display: 'inline-block' }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#6C7393',
              marginLeft: '6px',
            }}>
              ~ aimen.dev/whoami
            </span>
          </div>

          {/* Terminal body */}
          <div style={{
            padding: '24px 28px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            lineHeight: 1.85,
          }}>
            <div style={{ color: '#3D4566' }}>// quick summary</div>
            <div style={{ marginTop: '4px' }}>
              <span style={{ color: '#A6E3A1' }}>❯ </span>
              <span style={{ color: '#E8F0FE' }}>cat whoami.json</span>
            </div>
            <div style={{ marginTop: '8px', paddingLeft: '0' }}>
              <div style={{ color: '#6C7393' }}>{'{'}</div>
              <div style={{ paddingLeft: '20px' }}>
                <span style={{ color: '#89B4FA' }}>&quot;name&quot;</span>
                <span style={{ color: '#6C7393' }}>: </span>
                <span style={{ color: '#A6E3A1' }}>&quot;Aimen&quot;</span>
                <span style={{ color: '#6C7393' }}>,</span>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                <span style={{ color: '#89B4FA' }}>&quot;role&quot;</span>
                <span style={{ color: '#6C7393' }}>: </span>
                <span style={{ color: '#A6E3A1' }}>&quot;support engineer → SRE (in progress)&quot;</span>
                <span style={{ color: '#6C7393' }}>,</span>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                <span style={{ color: '#89B4FA' }}>&quot;currently_learning&quot;</span>
                <span style={{ color: '#6C7393' }}>: </span>
                <span style={{ color: '#A6E3A1' }}>[&quot;Terraform&quot;, &quot;Kubernetes&quot;, &quot;CI/CD&quot;]</span>
                <span style={{ color: '#6C7393' }}>,</span>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                <span style={{ color: '#89B4FA' }}>&quot;blog_purpose&quot;</span>
                <span style={{ color: '#6C7393' }}>: </span>
                <span style={{ color: '#A6E3A1' }}>&quot;document the journey, not just the destination&quot;</span>
                <span style={{ color: '#6C7393' }}>,</span>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                <span style={{ color: '#89B4FA' }}>&quot;uses_ai&quot;</span>
                <span style={{ color: '#6C7393' }}>: </span>
                <span style={{ color: '#F38BA8' }}>true</span>
                <span style={{ color: '#6C7393' }}>,</span>
              </div>
              <div style={{ paddingLeft: '20px' }}>
                <span style={{ color: '#89B4FA' }}>&quot;posts_published&quot;</span>
                <span style={{ color: '#6C7393' }}>: </span>
                <span style={{ color: '#F38BA8' }}>{postCount}</span>
              </div>
              <div style={{ color: '#6C7393' }}>{'}'}</div>
            </div>
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#A6E3A1' }}>❯ </span>
              <span style={{
                color: '#89B4FA',
                animation: 'blink 1s step-end infinite',
                display: 'inline-block',
              }}>▋</span>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  )
}
