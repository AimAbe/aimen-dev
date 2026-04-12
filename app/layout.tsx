import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { ThemeToggle } from '@/app/components/ThemeToggle'

export const metadata: Metadata = {
  title: 'aimen.dev',
  description: 'Developer blog and portfolio',
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-mono font-bold text-accent hover:opacity-80 transition-opacity"
        >
          aimen.dev
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            blog
          </Link>
          <a
            href="https://github.com/AimAbe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            github
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-text-dim font-mono">
          © {new Date().getFullYear()} aimen.dev
        </span>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/AimAbe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-text-dim hover:text-text-muted transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:aimen.aberra@gmail.com"
            className="text-sm text-text-dim hover:text-text-muted transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <div className="pt-16 min-h-screen">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
