import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
      {
        protocol: "https",
        hostname: "thumbnail.komiku.org",
      },
      {
        protocol: "https",
        hostname: "minio-prod-2.komikcast.to",
      },
    ],
  },
};

export default nextConfig;
