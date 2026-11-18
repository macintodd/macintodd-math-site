import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import './theme.css'
import './study-fonts.css'
import './redesign.css'
import {StudySketch} from '@/components/StudySketch'
import {lessonBridgeBootstrap} from '@/lib/mathboard/lesson-bridge'
import 'katex/dist/katex.min.css'

export const metadata: Metadata = {
  title: { default: 'MacIntodd Math | Class lessons', template: '%s | MacIntodd Math' },
  description: 'Algebra 2 and Precalculus with clear lessons, worked examples, videos, and printable notes and practice.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><script dangerouslySetInnerHTML={{__html:lessonBridgeBootstrap}}/></head><body>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="shell header-inner">
      <Link className="brand" href="/" aria-label="MacIntodd Math home"><span className="study-wordmark">macintodd.net</span></Link>
      <nav aria-label="Main navigation"><Link href="/courses/algebra-2">Algebra 2</Link><Link href="/courses/precalculus">Precalculus</Link><Link href="/apps">Practice apps</Link><Link href="/resources">Resources</Link></nav>
    </div></header>
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer global-wave-footer"><StudySketch kind="wave"/><div className="shell footer-inner"><Link className="footer-brand" href="/">macintodd.net</Link><span>Mac’s Math · Algebra 2 &amp; Precalculus</span><span>© {new Date().getFullYear()} Shawn Todd</span></div></footer>
  </body></html>
}
