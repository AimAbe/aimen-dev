'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useDebounce } from '@/lib/useDebounce'

type Result = { slug: string; title: string; excerpt: string | null; tag: string | null }

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      setOpen(false)
      return
    }

    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data)
        setOpen(true)
      })
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
      />
      {open && (
        <div className="absolute top-full mt-2 w-full bg-bg-card border border-border rounded-lg shadow-xl z-50 animate-in overflow-hidden">
          {loading && (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-bg-hover rounded animate-pulse" />
              ))}
            </div>
          )}
          {!loading && results.length === 0 && (
            <p className="p-4 text-sm text-text-dim">No results for "{query}"</p>
          )}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/blog/${r.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex flex-col gap-0.5 px-4 py-3 hover:bg-bg-hover transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {r.tag && <span className="tag text-[10px]">{r.tag}</span>}
                      <span className="text-sm font-semibold">{r.title}</span>
                    </div>
                    {r.excerpt && (
                      <span className="text-xs text-text-dim truncate">{r.excerpt}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
