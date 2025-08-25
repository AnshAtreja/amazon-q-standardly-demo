/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEMO_EMAIL: process.env.DEMO_EMAIL,
    DEMO_PASSWORD: process.env.DEMO_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  }
}

module.exports = nextConfig