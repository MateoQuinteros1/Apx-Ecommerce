import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["sequelize", "sequelize-typescript", "pg"],
};

export default nextConfig;
