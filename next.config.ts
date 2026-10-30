import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Old flat routes moved under /products.
  async redirects() {
    return [
      { source: "/cabinets", destination: "/products/cabinets", permanent: true },
      { source: "/office-furniture", destination: "/products", permanent: true },
    ];
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
