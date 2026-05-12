import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px',
        background: 'rgba(30,36,48,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #313244',
      }}>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '14px',
          fontWeight: 500,
          color: '#89B4FA',
          textDecoration: 'none',
        }}>
          aimen<span style={{ color: '#6C7393', fontWeight: 300 }}>.dev</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          <Link href="/blog" className="nav-link">blog</Link>
          <Link href="https://github.com/AimAbe" className="nav-link">github</Link>
        </div>
      </nav>

      {/* Page content */}
      <div style={{ paddingTop: '57px' }}>
        {children}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #313244',
        padding: '28px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#6C7393' }}>
          <strong style={{ color: '#89B4FA', fontWeight: 400 }}>aimen.dev</strong>
          {' · built with intention'}
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="https://github.com/AimAbe" className="footer-link">github</a>
          <a href="/rss" className="footer-link">rss</a>
          <a href="mailto:aimen.aberra@gmail.com" className="footer-link">email</a>
        </div>
      </footer>

    </div>
  )
}
