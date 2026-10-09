import Link from 'next/link'
import { prisma, withDbRetry } from '@/lib/db'
import Layout from '@/app/components/Layout'
import Search from '@/app/components/Search'

export const revalidate = 60

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function HomePage() {
  const posts = await withDbRetry(() =>
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { slug: true, title: true, tag: true, createdAt: true },
    })
  )

  return (
    <Layout>
      <Search />
      {posts.length === 0 ? (
        <p className="empty">No posts yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="post-link">
                <span className="post-link-title">{post.title}</span>
                <span className="post-meta">
                  <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt)}</time>
                  {post.tag && <span>{post.tag}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  )
}
