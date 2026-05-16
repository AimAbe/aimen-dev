import Link from 'next/link'
import { getAdjacentPosts } from '@/lib/getAdjacentPosts'

export default async function PostNav({ currentSlug }: { currentSlug: string }) {
  const { prev, next } = await getAdjacentPosts(currentSlug)

  if (!prev && !next) return null

  return (
    <nav className="post-nav">
      <div className="col">
        {prev && (
          <Link href={`/blog/${prev.slug}`}>
            <span className="lbl"><span className="t-prompt">$&nbsp;</span>cd ../prev</span>
            <span className="ttl">{prev.title}</span>
          </Link>
        )}
      </div>
      <div className="col right">
        {next && (
          <Link href={`/blog/${next.slug}`}>
            <span className="lbl">cd ../next<span className="t-prompt">&nbsp;→</span></span>
            <span className="ttl">{next.title}</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
