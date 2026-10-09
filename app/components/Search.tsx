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
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts…"
        aria-label="Search posts"
        className="field"
      />
      {open && (
        <div className="search-results">
          {loading && [1, 2, 3].map((i) => <div key={i} className="search-skeleton" />)}
          {!loading && results.length === 0 && <p>No results for &quot;{query}&quot;</p>}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} onClick={() => setOpen(false)}>
                    {r.title}
                    {r.tag && <span>{r.tag}</span>}
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
