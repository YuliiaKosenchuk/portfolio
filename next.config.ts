import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  /* Твої інші налаштування Next.js тут, наприклад: */
  // reactStrictMode: true,
};

export default withNextIntl(nextConfig);