import Link from 'next/link'
import { prisma } from '@/lib/db'

export const revalidate = 60 // Revalidate every 60 seconds

function getTagClass(tag: string | null): string {
  if (!tag) return 'tag-build'
  const t = tag.toLowerCase()
  if (t.includes('build')) return 'tag-build'
  if (t.includes('deep')) return 'tag-deep'
  if (t.includes('career')) return 'tag-career'
  if (t.includes('full')) return 'tag-full'
  return 'tag-build'
}

export default async function HomePage() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      tag: true,
      createdAt: true,
    },
  })

  const totalPosts = await prisma.post.count({ where: { published: true } })

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <div className="eyebrow-dot" />
            Hi, I&apos;m Aimen
          </div>
          <h1 className="hero-title">
            I build things<br />
            <span className="line2">for the <span className="accent-word">web.</span></span>
          </h1>
          <p className="hero-sub">
            Developer, tinkerer, and occasional writer. I document what I learn
            and build in public. This site is one of those projects.
          </p>
          <div className="hero-cta">
            <a href="#recent-writing" className="btn btn-primary">Read the blog ↓</a>
            <a href="https://github.com/AimAbe" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">GitHub</a>
          </div>
        </div>
        <a href="#recent-writing" className="hero-scroll-indicator" aria-label="Scroll to recent writing">
          <span className="hero-scroll-chevron" />
        </a>
      </section>

      {/* ABOUT */}
      <div className="about-strip">
        <div className="about-cell">
          <p className="cell-label">who</p>
          <p className="cell-text">
            Developer, builder, perpetual learner. I write about things I&apos;m actively working through —
            <em> not the things I&apos;ve already mastered.</em>
          </p>
        </div>
        <div className="about-cell">
          <p className="cell-label">stack</p>
          <p className="cell-text" style={{ fontSize: '15px', fontFamily: 'var(--sans)', fontWeight: 300 }}>Currently building with:</p>
          <div className="stack-tags">
            <span className="stack-tag">Next.js</span>
            <span className="stack-tag">TypeScript</span>
            <span className="stack-tag">PostgreSQL</span>
            <span className="stack-tag">Prisma</span>
            <span className="stack-tag">Tailwind</span>
            <span className="stack-tag">Vercel</span>
          </div>
        </div>
      </div>

      {/* POSTS */}
      <section id="recent-writing" className="posts-section">
        <div className="section-header">
          <span className="section-title">Recent Writing</span>
          <Link href="/blog" className="section-link">All posts →</Link>
        </div>

        <div className="post-list">
          {recentPosts.length === 0 ? (
            <div className="post-card" style={{ justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted)' }}>No posts yet. Check back soon.</span>
            </div>
          ) : (
            recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-card">
                <div className="post-card-left">
                  <div className="post-meta">
                    {post.tag && <span className={`post-tag ${getTagClass(post.tag)}`}>{post.tag}</span>}
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="post-title-text">{post.title}</div>
                  {post.excerpt && <div className="post-excerpt">{post.excerpt}</div>}
                </div>
                <span className="post-arrow">→</span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* TERMINAL */}
      <section className="terminal-section">
        <div className="terminal">
          <div className="terminal-bar">
            <div className="t-dot t-red" />
            <div className="t-dot t-yellow" />
            <div className="t-dot t-green" />
            <span className="t-title">~ aimen.dev/whoami</span>
          </div>
          <div className="terminal-body">
            <p className="t-comment">{'// quick summary'}</p>
            <br />
            <p className="t-prompt">cat whoami.json</p>
            <br />
            <p>{'{'}</p>
            <p>&nbsp;&nbsp;<span className="t-key">&quot;name&quot;</span>: <span className="t-str">&quot;Aimen Aberra&quot;</span>,</p>
            <p>&nbsp;&nbsp;<span className="t-key">&quot;role&quot;</span>: <span className="t-str">&quot;support engineer → enterprise analyst → SRE (in progress)&quot;</span>,</p>
            <p>&nbsp;&nbsp;<span className="t-key">&quot;currently_learning&quot;</span>: [<span className="t-str">&quot;Go&quot;</span>, <span className="t-str">&quot;Docker&quot;</span>, <span className="t-str">&quot;AWS&quot;</span>, <span className="t-str">&quot;CI/CD&quot;</span>],</p>
            <p>&nbsp;&nbsp;<span className="t-key">&quot;blog_purpose&quot;</span>: <span className="t-str">&quot;document the journey, not just the destination&quot;</span>,</p>
            <p>&nbsp;&nbsp;<span className="t-key">&quot;uses_ai&quot;</span>: <span className="t-val">true</span>, <span className="t-comment">{'// openly and honestly'}</span></p>
            <p>&nbsp;&nbsp;<span className="t-key">&quot;posts_published&quot;</span>: <span className="t-val">{totalPosts}</span></p>
            <p>{'}'}</p>
            <br />
            <p className="t-prompt"><span className="t-cursor" /></p>
          </div>
        </div>
      </section>
    </>
  )
}
