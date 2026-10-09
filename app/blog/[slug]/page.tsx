import { notFound } from 'next/navigation'
import { prisma, withDbRetry } from '@/lib/db'
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
  const posts = await withDbRetry(() =>
    prisma.post.findMany({ where: { published: true }, select: { slug: true } })
  )
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await withDbRetry(() =>
    prisma.post.findFirst({
      where: { slug, published: true },
      select: { id: true, title: true, content: true, tag: true, createdAt: true },
    })
  )

  if (!post) notFound()

  return (
    <Layout>
      <article>
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            {post.tag && <span>{post.tag}</span>}
          </div>
        </header>
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <Reactions postId={post.id} />
      <PostNav currentSlug={slug} />

      <section className="comments">
        <h2>Comments</h2>
        <CommentsDisplay slug={slug} />
        <CommentForm slug={slug} />
      </section>
    </Layout>
  )
}
