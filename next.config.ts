import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Upozorenje: Ovo dozvoljava produkcioni build na Vercelu čak i ako postoje ESLint greške.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

