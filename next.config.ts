import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Fixes workspace root detection warning when a parent package-lock.json exists
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
