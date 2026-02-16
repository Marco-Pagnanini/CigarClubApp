/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.USERS_URL}/api/auth/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${process.env.USERS_URL}/api/users/:path*`,
      },
      {
        source: '/api/tobacconists/:path*',
        destination: `${process.env.CATALOG_URL}/api/tobacconists/:path*`,
      },
      {
        source: '/api/panels/:path*',
        destination: `${process.env.CATALOG_URL}/api/panels/:path*`,
      },
      {
        source: '/api/brands/:path*',
        destination: `${process.env.CATALOG_URL}/api/brands/:path*`,
      },
      {
        source: '/api/posts/:path*',
        destination: `${process.env.POSTS_URL}/api/posts/:path*`,
      },
    ];
  },
};

export default nextConfig;
