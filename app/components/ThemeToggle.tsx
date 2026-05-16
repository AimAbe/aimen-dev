'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null
    const initial = stored ?? 'dark'
    setTheme(initial)
    document.documentElement.dataset.theme = initial
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
  }

  return (
    <button onClick={toggle} className="hdr-link" aria-label="toggle theme">
      [{theme === 'dark' ? 'light' : 'dark'}]
    </button>
  )
}
