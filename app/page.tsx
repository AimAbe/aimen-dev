import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function HomePage() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
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
      <section className="pt-24 pb-16">
        <p className="text-sm font-mono text-accent mb-4">Hi, I&apos;m Aimen</p>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
          I build things for the web<span className="text-accent">.</span>
        </h1>
        <p className="text-lg text-text-muted leading-relaxed max-w-xl">
          Developer, tinkerer, and occasional writer. I document what I learn
          and build in public. This site is one of those projects.
        </p>
        <div className="flex items-center gap-4 mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-accent text-bg font-mono text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Read the blog →
          </Link>
          <a
            href="https://github.com/AimAbe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border text-text-muted font-mono text-sm font-medium px-5 py-2.5 rounded-lg hover:border-border-hover hover:text-text transition-all"
          >
            GitHub
          </a>
        </div>
      </section>

      <hr className="border-border" />

      <section className="py-16">
        <h2 className="text-sm font-mono text-text-dim uppercase tracking-widest mb-8">
          Recent Writing
        </h2>

        {recentPosts.length === 0 ? (
          <p className="text-text-muted">No posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-center justify-between gap-4 py-4 px-4 -mx-4 rounded-lg hover:bg-bg-card transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      {post.tag && <span className="tag">{post.tag}</span>}
                      <h3 className="font-semibold truncate group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    {post.excerpt && (
                      <p className="text-sm text-text-muted truncate">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <time className="text-xs font-mono text-text-dim whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {recentPosts.length > 0 && (
          <Link
            href="/blog"
            className="inline-block mt-8 text-sm font-mono text-accent hover:underline underline-offset-4"
          >
            All posts →
          </Link>
        )}
      </section>
    </main>
  )
}
