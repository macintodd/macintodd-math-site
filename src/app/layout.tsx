import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  title: { default: 'MacIntodd Math | Make sense of the math.', template: '%s | MacIntodd Math' },
  description: 'Algebra 2 and Precalculus with clear lessons, worked examples, videos, and printable notes and practice.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="shell header-inner">
      <Link className="brand" href="/" aria-label="MacIntodd Math home"><span className="brand-symbol" aria-hidden="true">m<span>↗</span></span><span>MacIntodd<span className="brand-sub">MATH, MADE CLEAR.</span></span></Link>
      <nav aria-label="Main navigation"><Link href="/courses/algebra-2">Algebra 2</Link><Link href="/courses/precalculus">Precalculus</Link><Link href="/apps">Practice apps</Link><Link href="/resources">Resources</Link></nav>
    </div></header>
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer"><div className="shell footer-inner"><Link className="footer-brand" href="/">MacIntodd Math<span>A little clarity. A lot of possibility.</span></Link><p>Algebra 2 · Precalculus<br />Notes, examples, and practice for your next step.</p><span>© {new Date().getFullYear()} Shawn Todd</span></div></footer>
  </body></html>
}
