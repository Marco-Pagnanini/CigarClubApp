/** @type {import('next').NextConfig} */

const ip = '10.0.26.146'
const nextConfig = {
  async rewrites() {
    return [
      // 1. Servizio di Autenticazione (Porta 8081)
      {
        source: '/api/auth/:path*',
        destination: `http://${ip}:8081/api/auth/:path*`,
      },

      // 2. Servizio Tobacconists (Porta 8080)
      {
        source: '/api/tobacconists/:path*',
        destination: `http://${ip}:8080/api/tobacconists/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `http://${ip}:8081/api/users/:path*`,
      },
      {
        source: '/api/panels/:path*',
        destination: `http://${ip}:8080/api/panels/:path*`,
      }
    ];
  },
};

export default nextConfig;
