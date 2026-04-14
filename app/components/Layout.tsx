import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#1E2430', color: '#CDD6F4', fontFamily: 'Sora, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid #313244',
        background: 'rgba(30,36,48,0.92)',
        backdropFilter: 'blur(12px)'
      }}>
        <Link href="/" style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '14px',
          color: '#89B4FA',
          textDecoration: 'none',
          letterSpacing: '0.05em'
        }}>
          aimen<span style={{ color: '#6C7393' }}>.dev</span>
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'writing', href: '/blog' },
            { label: 'about', href: '/#about' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              color: '#6C7393',
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
      <div style={{ paddingTop: '80px' }}>
        {children}
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #313244',
        padding: '32px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '80px'
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#6C7393' }}>
          <span style={{ color: '#89B4FA' }}>aimen.dev</span> · built with intention
        </span>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'github', href: 'https://github.com' },
            { label: 'rss', href: '/rss' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#6C7393',
              textDecoration: 'none'
            }}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  )
}