import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <header className="site-header">
        <Link href="/" className="logo">aimen<span>.dev</span></Link>
        <ThemeToggle />
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Aimen Aberra</span>
        <nav>
          <a href="https://github.com/AimAbe">GitHub</a>
          <a href="mailto:aimen.aberra@gmail.com">Email</a>
        </nav>
      </footer>
    </div>
  )
}
