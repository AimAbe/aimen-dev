import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      {/* Header */}
      <header className="site-header">
        <div className="hdr-row">
          <Link href="/" className="hdr-logo" aria-label="aimen.dev home">
            <span className="prompt">$&nbsp;</span>cd ~/<span className="name">aimen.dev</span>
          </Link>
          <nav className="hdr-nav">
            <Link href="/" className="hdr-link">./posts</Link>
            <Link href="/about" className="hdr-link">./about</Link>
            <a href="/feed.xml" className="hdr-link">./feed.xml</a>
            <a href="https://github.com/AimAbe" className="hdr-link">github</a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="shell-main">
        {children}
      </main>

      <footer className="site-footer">
        <div className="ftr-row">
          <span className="t-meta">
            <span className="t-mute2">$&nbsp;</span>echo "built with intention" {">>"}&nbsp;aimen.dev
          </span>
          <span className="t-meta">
            <a href="https://github.com/AimAbe" className="ftr-link">github</a>
            <span className="t-mute2"> · </span>
            <a href="/feed.xml" className="ftr-link">rss</a>
            <span className="t-mute2"> · </span>
            <a href="mailto:aimen.aberra@gmail.com" className="ftr-link">email</a>
          </span>
        </div>
      </footer>
    </div>
  )
}
