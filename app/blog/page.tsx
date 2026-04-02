import Link from 'next/link'
import { prisma } from '@/lib/db'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true, excerpt: true, tag: true, createdAt: true }
  })

  return (
    <main>
      <h1>Writing</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.excerpt}</p>
            <span>{post.tag}</span>
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </li>
        ))}
      </ul>
    </main>
  )
}