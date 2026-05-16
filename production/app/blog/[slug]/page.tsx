import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import CommentForm from '@/app/components/CommentForm'
import CommentsDisplay from '@/app/components/CommentsDisplay'
import PostNav from '@/app/components/PostNav'
import Reactions from '@/app/components/Reactions'
import Layout from '@/app/components/Layout'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

function fmtDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10)
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await prisma.post.findFirst({
    where: { slug, published: true },
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      tag: true,
      createdAt: true,
    },
  })

  if (!post) notFound()

  const bytes = new TextEncoder().encode(post.content).length

  return (
    <Layout>
      <article className="reader">
        {/* Reader bar */}
        <div className="reader-bar">
          <Link href="/" className="t-link">
            <span className="t-prompt">$&nbsp;</span>cd ..
          </Link>
          <span className="t-meta">
            posts/{fmtDate(post.createdAt).slice(0, 4)}/{slug}.md
            <span className="t-mute2"> · </span>
            {bytes.toLocaleString()} bytes
          </span>
        </div>

        {/* Header */}
        <header className="reader-header">
          <h1 className="t-h1">{post.title}</h1>
          <div className="reader-meta">
            <span className="t-meta">{fmtDate(post.createdAt)}</span>
            {post.tag && (
              <>
                <span className="t-prompt">·</span>
                <span className="t-tag">[{post.tag.toLowerCase()}]</span>
              </>
            )}
          </div>
          {post.excerpt && (
            <p className="t-body" style={{ marginTop: 'var(--s-4)', color: 'var(--fg-3)' }}>
              {post.excerpt}
            </p>
          )}
        </header>

        <hr className="hr-rule" />

        {/* Body */}
        <article className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {post.content}
          </ReactMarkdown>
        </article>

        <Reactions postId={post.id} />

        <PostNav currentSlug={slug} />

        {/* Comments */}
        <section style={{ marginTop: 'var(--s-7)' }}>
          <h2 className="t-h3" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--s-3)' }}>
            COMMENTS
          </h2>
          <CommentsDisplay slug={slug} />
          <CommentForm slug={slug} />
        </section>
      </article>
    </Layout>
  )
}
