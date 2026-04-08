import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Layout from '@/app/components/Layout'

const TAG_COLORS: Record<string, { bg: string; color: string }> = {
  'build log': { bg: 'rgba(200,255,87,0.1)', color: '#c8ff57' },
  'deep dive': { bg: 'rgba(87,200,255,0.1)', color: '#57c8ff' },
  'career':    { bg: 'rgba(255,107,107,0.1)', color: '#ff6b6b' },
}

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, published: true }
  })

  if (!post) notFound()

  const { bg, color } = TAG_COLORS[post.tag?.toLowerCase() ?? ''] ?? { bg: 'rgba(107,104,128,0.15)', color: '#6b6880' }

  return (
    <Layout>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '60px 48px' }}>

        {/* Post header */}
        <header style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #1e1e2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            {post.tag && (
              <span style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                padding: '3px 8px', borderRadius: '2px',
                background: bg, color, letterSpacing: '0.08em', textTransform: 'uppercase'
              }}>
                {post.tag}
              </span>
            )}
            <time style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#6b6880' }}>
              {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
          </div>
          <h1 style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 400, lineHeight: 1.1,
            letterSpacing: '-0.01em'
          }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ marginTop: '16px', fontSize: '16px', color: '#6b6880', fontWeight: 300, lineHeight: 1.65 }}>
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Post content */}
        <div className="prose prose-invert prose-headings:font-serif prose-code:text-[#c8ff57] max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

      </div>
    </Layout>
  )
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })
  return posts.map(p => ({ slug: p.slug }))
}