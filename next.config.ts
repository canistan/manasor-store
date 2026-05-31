import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  serverExternalPackages: ['iyzipay'],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './node_modules/iyzipay/**/*',
      './node_modules/postman-request/**/*'
    ],
  },
};

export default withPayload(nextConfig);
