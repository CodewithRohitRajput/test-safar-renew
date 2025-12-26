/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['safarwanderlust.com', 'secure.payu.in', 'localhost:3000', '0.0.0.0:3000']
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }]
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000/api'
      : 'https://safarwanderlust.com/api',
  },
  output: 'standalone',
  trailingSlash: true,
  distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
};

export default nextConfig;
