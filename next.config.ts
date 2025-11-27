import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "in-labs.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default nextConfig;
