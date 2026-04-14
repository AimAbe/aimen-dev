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
    <main style={{
      minHeight: '100vh',
      background: '#1E2430',
      color: '#CDD6F4',
      fontFamily: 'Sora, sans-serif',
      padding: '48px'
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', borderBottom: '1px solid #313244', paddingBottom: '24px' }}>
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#89B4FA', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>// admin</p>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: '36px', fontWeight: 400 }}>aimen.dev</h1>
          </div>
          <Link href="/admin/new" style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '12px 24px',
            background: '#89B4FA',
            color: '#1E2430',
            textDecoration: 'none',
            borderRadius: '3px',
            fontWeight: 500
          }}>
            + New Post
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: '#313244', border: '1px solid #313244', marginBottom: '32px' }}>
          {[
            { label: 'Total Posts', value: posts.length },
            { label: 'Published', value: posts.filter(p => p.published).length },
            { label: 'Drafts', value: posts.filter(p => !p.published).length },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#252D3D', padding: '24px 28px' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6C7393', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</p>
              <p style={{ fontFamily: 'Lora, serif', fontSize: '32px', color: '#89B4FA' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Post list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#313244', border: '1px solid #313244' }}>
          {posts.length === 0 && (
            <div style={{ background: '#252D3D', padding: '40px', textAlign: 'center', color: '#6C7393', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
              No posts yet. Create your first one.
            </div>
          )}
          {posts.map(post => (
            <div key={post.id} style={{ background: '#1E2430', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '2px',
                    background: post.published ? 'rgba(137,180,250,0.1)' : 'rgba(108,115,147,0.15)',
                    color: post.published ? '#89B4FA' : '#6C7393',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6C7393' }}>
                    {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ fontSize: '16px', color: '#CDD6F4' }}>{post.title}</p>
              </div>
              <Link href={`/admin/edit/${post.slug}`} style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: '#6C7393',
                textDecoration: 'none',
                border: '1px solid #313244',
                padding: '8px 16px',
                borderRadius: '3px',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap'
              }}>
                Edit →
              </Link>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6C7393', textDecoration: 'none' }}>← View site</Link>
          <Link href="/api/auth/signout" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6C7393', textDecoration: 'none' }}>Sign out</Link>
        </div>

      </div>
    </main>
  )
}