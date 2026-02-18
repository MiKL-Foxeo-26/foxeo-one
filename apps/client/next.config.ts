import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@foxeo/ui',
    '@foxeo/supabase',
    '@foxeo/utils',
    '@foxeo/types',
    '@foxeo/modules-chat',
  ],
}

export default nextConfig
