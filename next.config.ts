import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['crm-api.vnw-crm.com', 'crm-api-dev.vnw-crm.com', 'vnw-crm.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Defina o limite desejado, como '5mb', '10mb', etc.
    },
  },
}

export default nextConfig
