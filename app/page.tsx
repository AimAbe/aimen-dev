import Link from 'next/link'
import { prisma } from '@/lib/db'
import Layout from '@/app/components/Layout'
import Search from '@/app/components/Search'

export const revalidate = 60

function fmtDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10) // yyyy-mm-dd, lowercase by definition
}

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
  })

  return (
    <Layout>
      {/* Manpage banner */}
      <pre className="manpage-banner">AIMEN.DEV(7)                                                          AIMEN.DEV(7)</pre>

      {/* NAME */}
      <section className="man-section">
        <h2 className="t-h3">NAME</h2>
        <div className="indent">
          <p className="t-body">aimen.dev — a developer's notebook, posted to the open web.</p>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="man-section">
        <h2 className="t-h3">DESCRIPTION</h2>
        <div className="indent">
          <p className="t-body">
            enterprise analyst growing into backend development and devops. building
            side projects, documenting the learning, and occasionally sharing long-form 
            posts on the process. new content whenever—no set schedule.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="man-section">
        <h2 className="t-h3">SEARCH</h2>
        <div className="indent" style={{ maxWidth: 480 }}>
          <Search />
        </div>
      </section>

      {/* POSTS */}
      {posts.length > 0 && (
        <section className="man-section">
          <h2 className="t-h3">POSTS</h2>
          <div className="man-posts">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="man-post">
                <div className="man-post-head">
                  <span className="t-meta">{fmtDate(post.createdAt)}</span>
                  {post.tag && (
                    <>
                      <span className="t-prompt">·</span>
                      <span className="t-tag">[{post.tag.toLowerCase()}]</span>
                    </>
                  )}
                </div>
                <span className="man-post-title">{post.title}</span>
                {post.excerpt && (
                  <p className="man-post-excerpt">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SEE ALSO */}
      <section className="man-section">
        <h2 className="t-h3">SEE ALSO</h2>
        <div className="indent">
          <p className="t-body">
            <a href="https://github.com/AimAbe" className="t-link">github.com/aimabe</a>
            <span className="t-mute2">  ·  </span>
            <a href="mailto:aimen.aberra@gmail.com" className="t-link">aimen.aberra@gmail.com</a>
          </p>
        </div>
      </section>
    </Layout>
  )
}
