import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all typical localhost origins for development
  allowedDevOrigins: ["localhost", "127.0.0.1", "0.0.0.0", "::1"],
  // Keep puppeteer / chromium out of the server bundle.
  serverExternalPackages: ["puppeteer", "puppeteer-core", "@sparticuz/chromium"],
  // @sparticuz/chromium loads its Chromium binary from bin/*.br via a runtime
  // path that file-tracing misses, so force those assets into the export route's
  // serverless function.
  outputFileTracingIncludes: {
    "/api/resumes/**/export": ["./node_modules/@sparticuz/chromium/**/*"],
  },
};

export default nextConfig;
