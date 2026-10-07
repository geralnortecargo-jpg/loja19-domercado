import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite concluir o build mesmo que haja avisos de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Evita que avisos de formatação bloqueiem o deploy
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;