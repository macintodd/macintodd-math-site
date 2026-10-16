import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/assignments/unit1a', destination: '/courses/algebra-2/one-step-equations', permanent: true },
      { source: '/apps/quadratic-formula', destination: '/apps', permanent: false },
      { source: '/progress', destination: '/', permanent: false },
    ]
  },
  async headers() {
    return [
      { source: '/:path*', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      ] },
      { source: '/materials/:path*', headers: [
        { key: 'Content-Disposition', value: 'inline' },
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
      ] },
    ]
  },
}
export default nextConfig
