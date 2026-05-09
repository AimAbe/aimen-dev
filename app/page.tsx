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

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true },
  })

  return (
    <Layout>
      <div className="r-post-content" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        <div style={{ marginBottom: '32px' }}>
          <Search />
        </div>

        {posts.length === 0 ? (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#6C7393' }}>
            No posts yet. Check back soon.
          </div>
        ) : (
          posts.map((post) => {
            const date = new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="post-row r-home-row">
                {post.tag && (
                  <span className={getTagClass(post.tag)} style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
                    padding: '2px 8px', borderRadius: '3px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    display: 'inline-block', marginBottom: '8px',
                  }}>
                    {post.tag}
                  </span>
                )}
                <div className="post-title" style={{
                  fontFamily: "'Sora', sans-serif", fontSize: '18px', fontWeight: 500,
                  color: '#CDD6F4', lineHeight: 1.4, marginBottom: '6px',
                }}>
                  {post.title}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#6C7393' }}>
                  {date}
                  {post.excerpt && (
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '13px', fontWeight: 300 }}>
                      {' · '}{post.excerpt}
                    </span>
                  )}
                </div>
              </Link>
            )
          })
        )}
      </div>
    </Layout>
  )
}
