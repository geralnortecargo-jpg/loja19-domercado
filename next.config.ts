import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite concluir o build mesmo que haja avisos de TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;