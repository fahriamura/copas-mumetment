import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/templates',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
