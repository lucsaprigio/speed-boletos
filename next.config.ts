import type { NextConfig } from "next";

process.env.TZ = "America/Sao_Paulo";

console.log(
  `Running with timezone ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
);

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
