import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "sequelize",
    "sequelize-typescript",
    "pg",
    "pg-hstore",
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        "pg",
        "pg-hstore",
        "pg-native",
        "sequelize",
        "sequelize-typescript",
      ];
    }
    return config;
  },
};

export default nextConfig;
