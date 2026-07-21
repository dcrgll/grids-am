/** @type {import('next').NextConfig} */

import { fileURLToPath } from "node:url";

import createJiti from "jiti";

const jiti = createJiti(import.meta.filename);

jiti("./src/env");

const nextConfig = {
  async rewrites() {
    return [
      {
        destination: "https://lastfm.freetls.fastly.net/:path*",
        source: "/api/lastfm/images/:path*",
      },
      {
        destination: "https://i.scdn.co/:path*",
        source: "/api/spotify/images/:path*",
      },
    ];
  },
};

export default nextConfig;
