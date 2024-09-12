/** @type {import('next').NextConfig} */

import { fileURLToPath } from 'node:url'
import createJiti from 'jiti'

const jiti = createJiti(fileURLToPath(import.meta.url))

jiti('./src/env')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/images/:path*',
        destination: 'https://lastfm.freetls.fastly.net/:path*'
      }
    ]
  }
}

export default nextConfig
