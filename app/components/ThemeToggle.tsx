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
        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM8.22 4.22a1 1 0 011.415 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm7.07-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 101.414-1.414l-.707-.707zM4 10a1 1 0 100-2H3a1 1 0 000 2h1zm13-1a1 1 0 110 2h1a1 1 0 110-2h-1zM4.22 15.78a1 1 0 101.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm11.07.707l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 101.414 1.414zM10 15a1 1 0 110-2v-1a1 1 0 110 2v1zm0 4a1 1 0 100-2v-1a1 1 0 000 2v1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}
