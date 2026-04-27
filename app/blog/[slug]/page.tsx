import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import CommentForm from '@/app/components/CommentForm'
import CommentsDisplay from '@/app/components/CommentsDisplay'
import PostNav from '@/app/components/PostNav'
import Reactions from '@/app/components/Reactions'

export const revalidate = 60 // Revalidate every 60 seconds (ISR)

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
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

  return (
    <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
      <header className="mb-10">
        {post.tag && <span className="tag mb-4 inline-block">{post.tag}</span>}
        <h1 className="text-4xl font-bold leading-tight mb-4">{post.title}</h1>
        <time className="text-sm font-mono text-text-dim">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>

      <article className="prose prose-invert prose-headings:font-serif prose-code:text-[#89B4FA] max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
      </article>

      <Reactions postId={post.id} />

      <PostNav currentSlug={slug} />

      <section className="mt-16">
        <h2 className="text-xl font-semibold mb-6">Comments</h2>
        <CommentsDisplay slug={slug} />
        <CommentForm slug={slug} />
      </section>
    </main>
  )
}
