import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#E6EDF3', fontFamily: "'Outfit', sans-serif" }}>

      {/* Nav */}
      <nav className="r-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #30363D',
        background: 'rgba(13,17,23,0.92)',
        backdropFilter: 'blur(12px)',
      }}>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '13px',
          color: '#58A6FF',
          textDecoration: 'none',
          letterSpacing: '0.03em',
        }}>
          aimen<span style={{ color: '#8B949E' }}>.dev</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[
            { label: 'github', href: 'https://github.com/AimAbe' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#8B949E',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <div style={{ paddingTop: '57px' }}>
        {children}
      </div>

      {/* Footer */}
      <footer className="r-footer" style={{ borderTop: '1px solid #30363D' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#8B949E' }}>
          <span style={{ color: '#58A6FF' }}>aimen.dev</span> · built with intention
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'github', href: 'https://github.com/AimAbe' },
            { label: 'rss', href: '/rss' },
            { label: 'email', href: 'mailto:aimen.aberra@gmail.com' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#8B949E',
              textDecoration: 'none',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}
