import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

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

  return (
    <article>
      <header>
        <span>{post.tag}</span>
        <h1>{post.title}</h1>
        <time>{new Date(post.createdAt).toLocaleDateString()}</time>
      </header>
      <div className="prose prose-invert prose-headings:font-serif prose-code:text-[#c8ff57] max-w-none">
        <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
    </article>
  )
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true }
  })
  return posts.map(p => ({ slug: p.slug }))
}