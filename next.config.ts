import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "sequelize",
    "sequelize-typescript",
    "pg",
    "pg-hstore",
    "pg-native",
  ],
};

export default nextConfig;
