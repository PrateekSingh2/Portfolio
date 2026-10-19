import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "skillicons.dev" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/#hero",
        permanent: true,
      },
      {
        source: "/project",
        destination: "/projects",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
