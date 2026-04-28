import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import CommentForm from '@/app/components/CommentForm'
import CommentsDisplay from '@/app/components/CommentsDisplay'
import PostNav from '@/app/components/PostNav'
import Reactions from '@/app/components/Reactions'
import Layout from '@/app/components/Layout'
import Link from 'next/link'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

function getTagClass(tag: string | null): string {
  if (!tag) return 'tag-build'
  const t = tag.toLowerCase()
  if (t.includes('build')) return 'tag-build'
  if (t.includes('deep')) return 'tag-deep'
  if (t.includes('career')) return 'tag-career'
  if (t.includes('full')) return 'tag-fullstack'
  return 'tag-build'
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
    <Layout>
      <div className="r-post-content">

        {/* Back link */}
        <Link href="/blog" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '11px',
          color: '#7A6F65', textDecoration: 'none', display: 'inline-block', marginBottom: '40px',
        }}>
          ← all posts
        </Link>

        {/* Tag + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          {post.tag && (
            <span className={getTagClass(post.tag)} style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '10px',
              padding: '2px 8px', borderRadius: '3px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              {post.tag}
            </span>
          )}
          <time style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7A6F65',
          }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </time>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 400,
          lineHeight: 1.15,
          color: '#F7F3EE',
          margin: '0 0 16px',
        }}>
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p style={{
            fontSize: '16px', fontWeight: 300, color: '#7A6F65',
            lineHeight: 1.7, margin: '0 0 32px',
          }}>
            {post.excerpt}
          </p>
        )}

        {/* Divider */}
        <div style={{ height: '1px', background: '#2A2420', margin: '32px 0' }} />

        {/* Prose content */}
        <article className="prose prose-invert prose-headings:font-serif prose-code:text-[#E8B84B] max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {post.content}
          </ReactMarkdown>
        </article>

        <Reactions postId={post.id} />

        <PostNav currentSlug={slug} />

        <section style={{ marginTop: '64px' }}>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 600,
            color: '#F7F3EE', marginBottom: '24px',
          }}>
            Comments
          </h2>
          <CommentsDisplay slug={slug} />
          <CommentForm slug={slug} />
        </section>

      </div>
    </Layout>
  )
}
