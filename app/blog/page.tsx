import Link from 'next/link'
import { prisma } from '@/lib/db'
import Search from '@/app/components/Search'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      tag: true,
      createdAt: true,
    },
  })

  return (
    <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
      <section className="pt-24 pb-8">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-text-muted mb-6">Thoughts on building, learning, and shipping.</p>
        <Search />
      </section>

      {posts.length === 0 ? (
        <p className="text-text-muted py-12">Nothing here yet. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block py-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {post.tag && <span className="tag">{post.tag}</span>}
                      <h2 className="text-lg font-semibold group-hover:text-accent transition-colors truncate">
                        {post.title}
                      </h2>
                    </div>
                    {post.excerpt && (
                      <p className="text-sm text-text-muted leading-6">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <time className="text-xs font-mono text-text-dim whitespace-nowrap pt-1">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
