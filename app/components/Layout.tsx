import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#1E2430', color: '#E8F0FE', fontFamily: "'Sora', sans-serif" }}>

      {/* Nav */}
      <nav className="r-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #313244',
        background: 'rgba(30,36,48,0.92)',
        backdropFilter: 'blur(16px)',
      }}>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '13px',
          color: '#89B4FA',
          textDecoration: 'none',
          letterSpacing: '0.03em',
        }}>
          aimen<span style={{ color: '#6C7393' }}>.dev</span>
        </Link>
        {/* <div style={{ display: 'flex', gap: '28px' }}>
          {[
            { label: 'blog', href: '/blog' },
            { label: 'github', href: 'https://github.com/AimAbe' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#6C7393',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {link.label}
            </Link>
          ))}
        </div> */}
      </nav>

      {/* Page content */}
      <div style={{ paddingTop: '61px' }}>
        {children}
      </div>

      {/* Footer */}
      <footer className="r-footer" style={{ borderTop: '1px solid #313244' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#6C7393' }}>
          <span style={{ color: '#89B4FA' }}>aimen.dev</span> · built with intention
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'github', href: 'https://github.com/AimAbe' },
            { label: 'rss', href: '/rss' },
            { label: 'email', href: 'mailto:aimen.aberra@gmail.com' },
          ].map(link => (
            <a key={link.href} href={link.href} className="footer-link" style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}
