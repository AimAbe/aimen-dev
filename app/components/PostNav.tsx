import Link from 'next/link'
import { getAdjacentPosts } from '@/lib/getAdjacentPosts'

export default async function PostNav({ currentSlug }: { currentSlug: string }) {
  const { prev, next } = await getAdjacentPosts(currentSlug)

  if (!prev && !next) return null

  return (
    <nav className="flex items-center justify-between gap-4 mt-16 pt-8 border-t border-border">
      <div className="flex-1">
        {prev && (
          <Link href={`/blog/${prev.slug}`} className="group flex flex-col gap-1">
            <span className="text-xs font-mono text-text-dim">← Previous</span>
            <span className="text-sm font-semibold group-hover:text-accent transition-colors">
              {prev.title}
            </span>
          </Link>
        )}
      </div>
      <div className="flex-1 text-right">
        {next && (
          <Link href={`/blog/${next.slug}`} className="group flex flex-col gap-1 items-end">
            <span className="text-xs font-mono text-text-dim">Next →</span>
            <span className="text-sm font-semibold group-hover:text-accent transition-colors">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
