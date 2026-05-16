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
    <div ref={ref} className="search">
      <span className="search-prompt" aria-hidden="true">$&nbsp;</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="grep posts/..."
        className="input search-input"
        aria-label="search posts"
      />
      {open && (
        <div className="search-drop">
          {loading && (
            <p className="empty">
              <span className="t-prompt">…&nbsp;</span>searching
            </p>
          )}
          {!loading && results.length === 0 && (
            <p className="empty">
              <span className="t-prompt">!&nbsp;</span>no results for "{query}"
            </p>
          )}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} onClick={() => setOpen(false)}>
                    <div className="row">
                      <span className="name">{r.title}</span>
                      {r.tag && <span className="t-tag">[{r.tag.toLowerCase()}]</span>}
                    </div>
                    {r.excerpt && <div className="ex">{r.excerpt}</div>}
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
