import Link from 'next/link'
import { prisma } from '@/lib/db'

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'build log': { bg: 'rgba(200,255,87,0.1)', color: '#c8ff57' },
  'deep dive': { bg: 'rgba(87,200,255,0.1)', color: '#57c8ff' },
  'career':    { bg: 'rgba(255,107,107,0.1)', color: '#ff6b6b' },
}

function tagStyle(tag: string | null) {
  const t = tag?.toLowerCase() ?? ''
  return TAG_COLORS[t] ?? { bg: 'rgba(107,104,128,0.15)', color: '#6b6880' }
}

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true }
  })

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0c0f; }

        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(200,255,87,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,255,87,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
        }

        .ticker { display: flex; white-space: nowrap; animation: ticker 25s linear infinite; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .post-card-hover { background: #0c0c0f; transition: background 0.25s; }
        .post-card-hover:hover { background: #13131a; }
        .post-card-hover:hover .card-line { transform: scaleX(1); }
        .post-card-hover:hover .card-arrow { opacity: 1; transform: translateX(0); }

        .card-line {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 2px;
          background: #c8ff57;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s ease;
        }

        .card-arrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #c8ff57;
          opacity: 0; transform: translateX(-6px);
          transition: all 0.2s;
        }

        .status-dot { animation: pulse 2.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-1 { opacity: 0; animation: fadeUp 0.8s ease 0.1s forwards; }
        .fade-2 { opacity: 0; animation: fadeUp 0.9s ease 0.25s forwards; }
        .fade-3 { opacity: 0; animation: fadeUp 0.9s ease 0.4s forwards; }
        .fade-4 { opacity: 0; animation: fadeUp 0.9s ease 0.55s forwards; }

        @media (max-width: 768px) {
          .posts-grid { grid-template-columns: 1fr !important; }
          .featured-card { grid-column: span 1 !important; }
          .hero-title { font-size: 56px !important; }
          .nav-links { display: none !important; }
          .hero-section { padding: 100px 24px 60px !important; }
          .section-pad { padding: 60px 24px !important; }
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0c0c0f', color: '#e8e6f0', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>

        {/* NAV */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 48px',
          borderBottom: '1px solid #1e1e2a',
          background: 'rgba(12,12,15,0.92)',
          backdropFilter: 'blur(12px)'
        }}>
          <Link href="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: '#c8ff57', textDecoration: 'none', letterSpacing: '0.05em' }}>
            aimen<span style={{ color: '#6b6880' }}>.dev</span>
          </Link>
          <div className="nav-links" style={{ display: 'flex', gap: '32px', listStyle: 'none' }}>
            {[{ label: 'writing', href: '/blog' }, { label: 'about', href: '#about' }].map(l => (
              <Link key={l.href} href={l.href} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#6b6880', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 48px 80px', position: 'relative' }}>
          <div className="hero-grid" />
          <p className="fade-1" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c8ff57', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '28px' }}>
            <span style={{ color: '#6b6880' }}>// </span>developer journey · est. 2025
          </p>
          <h1 className="fade-2 hero-title" style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(56px, 9vw, 120px)', lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: '32px' }}>
            building<br />
            <em style={{ fontStyle: 'italic', color: '#6b6880' }}>in public,</em><br />
            <span style={{ color: '#c8ff57' }}>one commit</span><br />
            <em style={{ fontStyle: 'italic', color: '#6b6880' }}>at a time</em>
          </h1>
          <p className="fade-3" style={{ fontSize: '17px', fontWeight: 300, color: '#6b6880', maxWidth: '480px', lineHeight: 1.65, marginBottom: '48px' }}>
            Notes, learnings, and half-finished thoughts from someone figuring it out. Code, systems, and the occasional tangent.
          </p>
          <div className="fade-4" style={{ display: 'flex', gap: '16px' }}>
            <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '13px 24px', borderRadius: '3px', background: '#c8ff57', color: '#0c0c0f', textDecoration: 'none', fontWeight: 500 }}>
              Read the blog →
            </Link>
            <Link href="#about" style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '13px 24px', borderRadius: '3px', background: 'transparent', color: '#6b6880', textDecoration: 'none', border: '1px solid #1e1e2a' }}>
              About me
            </Link>
          </div>
          <div style={{ position: 'absolute', right: '48px', bottom: '60px', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6b6880' }}>
            <div className="status-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8ff57' }} />
            currently building: aimen.dev
          </div>
        </section>

        {/* TICKER */}
        <div style={{ borderTop: '1px solid #1e1e2a', borderBottom: '1px solid #1e1e2a', overflow: 'hidden', padding: '14px 0', background: '#13131a' }}>
          <div className="ticker">
            {['Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'Tailwind CSS', 'Railway', 'Vercel', 'NextAuth', 'Building in Public', 'SRE', 'Terraform', 'Kubernetes',
              'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'Tailwind CSS', 'Railway', 'Vercel', 'NextAuth', 'Building in Public', 'SRE', 'Terraform', 'Kubernetes'
            ].map((item, i) => (
              <span key={i} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6b6880', letterSpacing: '0.1em', padding: '0 40px' }}>
                <span style={{ color: '#c8ff57', marginRight: '8px' }}>→</span>{item}
              </span>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <div id="about" className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#1e1e2a', borderTop: '1px solid #1e1e2a', borderBottom: '1px solid #1e1e2a' }}>
          <div style={{ background: '#0c0c0f', padding: '56px 48px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c8ff57', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>who</p>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', lineHeight: 1.55 }}>
              Developer, builder, perpetual learner. I write about the things I'm actively working through —{' '}
              <em style={{ color: '#6b6880' }}>not the things I've already mastered.</em>
            </p>
          </div>
          <div style={{ background: '#13131a', padding: '56px 48px' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c8ff57', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>stack</p>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: '18px', marginBottom: '20px' }}>Currently reaching for:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind', 'Railway', 'Vercel', 'Terraform', 'Kubernetes'].map(tag => (
                <span key={tag} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', padding: '5px 12px', border: '1px solid #1e1e2a', borderRadius: '2px', color: '#6b6880' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* POSTS */}
        <section className="section-pad" style={{ padding: '80px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '48px', paddingBottom: '20px', borderBottom: '1px solid #1e1e2a' }}>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '36px', fontWeight: 400 }}>Recent writing</h2>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6b6880' }}>// {posts.length} posts</span>
          </div>

          {posts.length === 0 ? (
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#6b6880' }}>No posts yet.</p>
          ) : (
            <div className="posts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1e1e2a', border: '1px solid #1e1e2a' }}>

              {/* Featured post */}
              {featured && (() => {
                const { bg, color } = tagStyle(featured.tag)
                return (
                  <Link href={`/blog/${featured.slug}`} className="featured-card" style={{ gridColumn: 'span 2', textDecoration: 'none' }}>
                    <div className="post-card-hover" style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden', height: '100%' }}>
                      <div className="card-line" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        {featured.tag && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px', background: bg, color }}>{featured.tag}</span>}
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6b6880' }}>{new Date(featured.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '30px', fontWeight: 400, color: '#e8e6f0', lineHeight: 1.3, marginBottom: '14px' }}>{featured.title}</h3>
                      {featured.excerpt && <p style={{ fontSize: '14px', fontWeight: 300, color: '#6b6880', lineHeight: 1.65, marginBottom: '24px' }}>{featured.excerpt}</p>}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span className="card-arrow">read →</span>
                      </div>
                    </div>
                  </Link>
                )
              })()}

              {/* Rest of posts */}
              {rest.map(post => {
                const { bg, color } = tagStyle(post.tag)
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="post-card-hover" style={{ padding: '36px 32px', position: 'relative', overflow: 'hidden', height: '100%' }}>
                      <div className="card-line" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                        {post.tag && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '2px', background: bg, color }}>{post.tag}</span>}
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6b6880' }}>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: '22px', fontWeight: 400, color: '#e8e6f0', lineHeight: 1.3, marginBottom: '14px' }}>{post.title}</h3>
                      {post.excerpt && <p style={{ fontSize: '14px', fontWeight: 300, color: '#6b6880', lineHeight: 1.65, marginBottom: '24px' }}>{post.excerpt}</p>}
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <span className="card-arrow">read →</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <Link href="/blog" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#6b6880', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', border: '1px solid #1e1e2a', padding: '12px 24px', borderRadius: '3px' }}>
              All posts →
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid #1e1e2a', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6b6880' }}>
            <span style={{ color: '#c8ff57' }}>aimen.dev</span> · built with intention
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {[{ label: 'github', href: 'https://github.com' }, { label: 'rss', href: '/rss' }].map(l => (
              <a key={l.href} href={l.href} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6b6880', textDecoration: 'none' }}>{l.label}</a>
            ))}
          </div>
        </footer>

      </div>
    </>
  )
}