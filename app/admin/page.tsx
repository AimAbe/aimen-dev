import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import Layout from '@/app/components/Layout'

function fmtDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10)
}

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, title: true, published: true, createdAt: true, content: true }
  })

  return (
    <Layout>
      {/* Header */}
      <div className="admin-head">
        <div>
          <p className="t-meta">
            <span className="t-prompt">$&nbsp;</span>cd ~/aimen.dev/admin
          </p>
          <h1 className="t-h1" style={{ marginTop: 'var(--s-2)' }}>posts</h1>
        </div>
        <div style={{ display: 'flex', gap: 'var(--s-3)' }}>
          <Link href="/admin/comments" className="btn">[ moderate ]</Link>
          <Link href="/admin/new" className="btn btn-primary">[ + new post ]</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat">
          <p className="k">total posts</p>
          <p className="v">{posts.length}</p>
        </div>
        <div className="admin-stat">
          <p className="k">published</p>
          <p className="v">{posts.filter(p => p.published).length}</p>
        </div>
        <div className="admin-stat">
          <p className="k">drafts</p>
          <p className="v">{posts.filter(p => !p.published).length}</p>
        </div>
      </div>

      {/* ls -la table */}
      <p className="t-meta" style={{ marginBottom: 'var(--s-1)' }}>
        <span className="t-prompt">$&nbsp;</span>ls -la ~/posts
      </p>
      <p className="t-meta" style={{ marginBottom: 'var(--s-3)', borderBottom: '1px dashed var(--border)', paddingBottom: 'var(--s-2)' }}>
        total {posts.length}
      </p>

      {posts.length === 0 && (
        <p className="t-meta" style={{ padding: 'var(--s-5) 0' }}>
          <span className="t-prompt">!&nbsp;</span>no posts yet. start with <Link href="/admin/new" className="t-link">[ + new post ]</Link>.
        </p>
      )}

      {posts.length > 0 && (
        <table className="ls-table">
          <thead>
            <tr>
              <th>status</th>
              <th>date</th>
              <th className="num">bytes</th>
              <th>name</th>
              <th aria-label="actions"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => {
              const bytes = new TextEncoder().encode(post.content || '').length
              return (
                <tr key={post.id}>
                  <td>
                    <span className={`status ${post.published ? 'is-on' : 'is-warn'}`}>
                      {post.published ? 'published' : 'draft'}
                    </span>
                  </td>
                  <td className="t-meta">{fmtDate(post.createdAt)}</td>
                  <td className="t-meta num">{bytes.toLocaleString()}</td>
                  <td>
                    <Link href={`/admin/edit/${post.slug}`} className="ls-name">
                      {post.slug}.md
                    </Link>
                    <div className="ls-sub">
                      <span className="t-meta">{post.title}</span>
                    </div>
                  </td>
                  <td>
                    <Link href={`/admin/edit/${post.slug}`} className="t-link" style={{ fontSize: 'var(--fs-sm)' }}>
                      [ edit ]
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <hr className="hr-rule" />

      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--s-4)' }}>
          <Link href="/" className="t-link t-mute" style={{ fontSize: 'var(--fs-sm)' }}>
            <span className="t-prompt">$&nbsp;</span>cd /
          </Link>
          <Link href="/admin/comments" className="t-link t-mute" style={{ fontSize: 'var(--fs-sm)' }}>
            moderate comments
          </Link>
        </div>
        <Link href="/api/auth/signout" className="t-link t-mute" style={{ fontSize: 'var(--fs-sm)' }}>
          sign out
        </Link>
      </div>
    </Layout>
  )
}
