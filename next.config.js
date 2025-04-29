/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gerowallet.io']
  },
  webpack(config, { dev }) {
    config.experiments = {
      syncWebAssembly: true,
      layers: true
    }
    return config
  },
  env: {
    NEXT_PUBLIC_BLOCKFROST_PROJECT_ID: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID
  }
}

module.exports = nextConfig
