import type { Metadata } from 'next'
import Layout from '@/app/components/Layout'

export const metadata: Metadata = {
  title: 'about — aimen.dev',
  description: 'full-stack developer. notes from a self-taught builder shipping side projects no one asked for.',
}

export default function AboutPage() {
  return (
    <Layout>
      <pre className="manpage-banner">AIMEN(1)                                                              ABOUT(1)</pre>

      <section className="man-section">
        <h2 className="t-h3">NAME</h2>
        <div className="indent">
          <p className="t-body">aimen aberra — full-stack developer, self-taught builder.</p>
        </div>
      </section>

      <section className="man-section">
        <h2 className="t-h3">SYNOPSIS</h2>
        <div className="indent">
          <p className="t-body">
            <span className="t-prompt">$&nbsp;</span>
            aimen <span className="t-mute">--mode</span> [build|break|learn] <span className="t-mute">--output</span> [post|project|nothing]
          </p>
        </div>
      </section>

      <section className="man-section">
        <h2 className="t-h3">DESCRIPTION</h2>
        <div className="indent" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
          <p className="t-body">
            this site is a notebook. long-form posts on what i build, what i break, and what
            i learn doing it. no hot takes. no listicles. notes i would have wanted to find
            when i was stuck.
          </p>
          <p className="t-body">
            self-taught. still learning. new posts roughly twice a month — no schedule,
            no newsletter (yet).
          </p>
        </div>
      </section>

      <section className="man-section">
        <h2 className="t-h3">OPTIONS</h2>
        <div className="indent">
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {[
                ['--focus',    'deep-dive technical posts, career reflections, build logs'],
                ['--stack',    'typescript · next.js · react · postgres · prisma · tailwind'],
                ['--location', 'online, mostly'],
                ['--open-to',  'interesting problems, collaborations, coffee chats'],
              ].map(([flag, desc]) => (
                <tr key={flag} style={{ borderBottom: '1px dashed var(--border)' }}>
                  <td className="t-mono" style={{ paddingRight: 'var(--s-6)', paddingTop: 'var(--s-2)', paddingBottom: 'var(--s-2)', whiteSpace: 'nowrap', color: 'var(--accent)' }}>
                    {flag}
                  </td>
                  <td className="t-meta" style={{ paddingTop: 'var(--s-2)', paddingBottom: 'var(--s-2)' }}>
                    {desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="man-section">
        <h2 className="t-h3">SEE ALSO</h2>
        <div className="indent">
          <p className="t-body">
            <a href="https://github.com/AimAbe" className="t-link">github.com/aimabe</a>
            <span className="t-mute2">  ·  </span>
            <a href="mailto:aimen.aberra@gmail.com" className="t-link">aimen.aberra@gmail.com</a>
          </p>
        </div>
      </section>
    </Layout>
  )
}
