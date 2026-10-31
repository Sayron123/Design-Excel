import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // The inquiry form can carry a floor plan of up to 4 MB, plus the multipart overhead.
    serverActions: { bodySizeLimit: "5mb" },
  },
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
