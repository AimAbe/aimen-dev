import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, title: true, published: true, createdAt: true }
  })

  return (
    <main className="min-h-screen bg-bg text-text font-sans p-12">
      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12 border-b border-border pb-6">
          <div>
            <p className="font-mono text-[11px] text-accent tracking-[0.15em] uppercase mb-2">// admin</p>
            <h1 className="font-serif text-[36px] font-normal">aimen.dev</h1>
          </div>
          <Link
            href="/admin/new"
            className="font-mono text-xs tracking-[0.08em] uppercase px-6 py-3 bg-accent text-bg no-underline rounded font-medium hover:opacity-90 transition-opacity"
          >
            + New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-border border border-border mb-8">
          {[
            { label: 'Total Posts', value: posts.length },
            { label: 'Published', value: posts.filter(p => p.published).length },
            { label: 'Drafts', value: posts.filter(p => !p.published).length },
          ].map(stat => (
            <div key={stat.label} className="bg-bg-card px-7 py-6">
              <p className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-2">{stat.label}</p>
              <p className="font-serif text-[32px] text-accent">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Post list */}
        <div className="flex flex-col gap-px bg-border border border-border">
          {posts.length === 0 && (
            <div className="bg-bg-card p-10 text-center text-text-muted font-mono text-[13px]">
              No posts yet. Create your first one.
            </div>
          )}
          {posts.map(post => (
            <div key={post.id} className="bg-bg px-7 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-sm tracking-[0.08em] uppercase ${
                    post.published
                      ? 'bg-accent-muted text-accent'
                      : 'bg-text-muted/15 text-text-muted'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">
                    {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-base text-text">{post.title}</p>
              </div>
              <Link
                href={`/admin/edit/${post.slug}`}
                className="font-mono text-[11px] text-text-muted no-underline border border-border px-4 py-2 rounded tracking-[0.06em] whitespace-nowrap hover:text-text hover:border-border-hover transition-colors"
              >
                Edit →
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center border-t border-border pt-6">
          <div className="flex gap-6">
            <Link href="/" className="font-mono text-[11px] text-text-muted no-underline hover:text-text transition-colors">← View site</Link>
            <Link href="/admin/comments" className="font-mono text-[11px] text-text-muted no-underline hover:text-text transition-colors">Moderate comments</Link>
          </div>
          <Link href="/api/auth/signout" className="font-mono text-[11px] text-text-muted no-underline hover:text-text transition-colors">Sign out</Link>
        </div>

      </div>
    </main>
  )
}
