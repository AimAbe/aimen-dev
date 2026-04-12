'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const htmlElement = document.documentElement
    setIsLight(htmlElement.classList.contains('light'))
  }, [])

  const toggleTheme = () => {
    const htmlElement = document.documentElement
    const newIsLight = !isLight

    if (newIsLight) {
      htmlElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    } else {
      htmlElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    }

    setIsLight(newIsLight)
  }

  if (!mounted) {
    return <div className="w-6 h-6" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-border hover:bg-bg-hover transition-colors"
      aria-label="Toggle theme"
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLight ? (
        <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 14c.2-1 .7-1.7 1-2.5a6 6 0 1 0-11 0c.3.8.8 1.5 1 2.5" />
          <path d="M9 18h6" />
          <path d="M10 21h4" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}
