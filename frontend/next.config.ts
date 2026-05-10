import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      /*{ TADY TOHLE BUDE V PRODUKCI!!!
        protocol: "https",
        hostname: "api.tvoje-domena.cz", // ← sem dej svou produkční API doménu
        pathname: "/**",
        },*/
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;