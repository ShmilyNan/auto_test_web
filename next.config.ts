import type { NextConfig } from 'next';
// import path from 'path';
const apiProxyOrigin = process.env.API_PROXY_ORIGIN || 'http://api.autotest:5000';

const nextConfig: NextConfig = {
  output: 'standalone',
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiProxyOrigin}/api/v1/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiProxyOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
