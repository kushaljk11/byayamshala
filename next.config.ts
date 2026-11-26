import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static website: `next build` outputs plain HTML/CSS/JS to /out
  output: "export",
  trailingSlash: true,
  images: {
    // The default image optimizer needs a server; static export serves images as-is
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
