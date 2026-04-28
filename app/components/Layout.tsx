import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#141010', color: '#F7F3EE', fontFamily: "'Outfit', sans-serif" }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        borderBottom: '1px solid #2A2420',
        background: 'rgba(20,16,16,0.92)',
        backdropFilter: 'blur(12px)',
      }}>
        <Link href="/" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '13px',
          color: '#E8B84B',
          textDecoration: 'none',
          letterSpacing: '0.03em',
        }}>
          aimen<span style={{ color: '#7A6F65' }}>.dev</span>
        </Link>
        <div style={{ display: 'flex', gap: '28px' }}>
          {[
            { label: 'blog', href: '/blog' },
            { label: 'github', href: 'https://github.com/AimAbe' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: '#7A6F65',
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
      <footer style={{
        borderTop: '1px solid #2A2420',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7A6F65' }}>
          <span style={{ color: '#E8B84B' }}>aimen.dev</span> · built with intention
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
              color: '#7A6F65',
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
