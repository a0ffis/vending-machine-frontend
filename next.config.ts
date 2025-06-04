import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("http://localhost:80/**")],
  },
};

export default nextConfig;
