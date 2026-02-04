/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.188.59:8081/api/:path*',
      },
    ];
  },
};

export default nextConfig;
