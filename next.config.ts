import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // تمكين RTL للدعم العربي الكامل
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
  },
};

export default nextConfig;
