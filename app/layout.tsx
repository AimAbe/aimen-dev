import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'aimen.dev',
  description: 'Developer blog and portfolio',
}

function Navbar() {
  return (
    <nav className="site-nav">
      <Link href="/" className="nav-logo">
        aimen<span>.dev</span>
      </Link>
      <ul className="nav-links">
        <li><Link href="/blog">blog</Link></li>
        <li><a href="https://github.com/AimAbe" target="_blank" rel="noopener noreferrer">github</a></li>
      </ul>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <strong>aimen.dev</strong> · built with intention
      </div>
      <div className="footer-links">
        <a href="https://github.com/AimAbe" target="_blank" rel="noopener noreferrer">github</a>
        <a href="mailto:aimen.aberra@gmail.com">email</a>
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
