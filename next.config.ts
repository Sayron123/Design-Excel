import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Old flat routes moved under /products; /quote became /inquire.
  async redirects() {
    return [
      { source: "/quote", destination: "/inquire", permanent: true },
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
