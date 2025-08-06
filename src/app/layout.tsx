import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'MacIntodd Math - Algebra 2',
  description: 'Interactive Algebra 2 assignments and math apps for students',
  keywords: ['algebra', 'math', 'education', 'assignments', 'interactive'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">MacIntodd Math</h1>
            <p className="text-blue-100">Algebra 2 - Interactive Learning</p>
          </div>
        </header>
        
        <nav className="bg-blue-500 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex space-x-6">
              <Link href="/" className="hover:text-blue-200 transition-colors">Home</Link>
              <Link href="/assignments" className="hover:text-blue-200 transition-colors">Assignments</Link>
              <Link href="/apps" className="hover:text-blue-200 transition-colors">Math Apps</Link>
              <Link href="/progress" className="hover:text-blue-200 transition-colors">Progress</Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-800 text-white mt-auto">
          <div className="container mx-auto px-4 py-6 text-center">
            <p>&copy; 2025 MacIntodd Math. Built with Next.js for Algebra 2 students.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
