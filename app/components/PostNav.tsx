import Link from 'next/link'
import { getAdjacentPosts } from '@/lib/getAdjacentPosts'

export default async function PostNav({ currentSlug }: { currentSlug: string }) {
  const { prev, next } = await getAdjacentPosts(currentSlug)
  if (!prev && !next) return null

  return (
    <nav className="post-nav" aria-label="More posts">
      {prev ? (
        <Link href={`/blog/${prev.slug}`}>
          <span className="post-nav-label">Previous</span>
          <span className="post-nav-title">{prev.title}</span>
        </Link>
      ) : <span />}
      {next ? (
        <Link href={`/blog/${next.slug}`} className="next">
          <span className="post-nav-label">Next</span>
          <span className="post-nav-title">{next.title}</span>
        </Link>
      ) : <span />}
    </nav>
  )
}
