import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all typical localhost origins for development
  allowedDevOrigins: ["localhost", "127.0.0.1", "0.0.0.0", "::1"],
};

export default nextConfig;
