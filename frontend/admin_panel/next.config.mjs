/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.14:8081/api/:path*',
      },
    ];
  },
};

export default nextConfig;
