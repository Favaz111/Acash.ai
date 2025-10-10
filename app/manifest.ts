import { MetadataRoute } from 'next';

/**
 * Dynamic PWA Manifest
 * Generates manifest.json at runtime
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Acash.ai - Your Smart Financial Assistant',
    short_name: 'Acash.ai',
    description:
      'Smart financial platform empowering you to achieve financial independence through AI-powered tools and personal financial assistant',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0066CC',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'ar-SA',
    dir: 'rtl',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['finance', 'business', 'productivity'],
    screenshots: [
      {
        src: '/screenshots/dashboard.png',
        sizes: '1280x720',
        type: 'image/png',
        label: 'Dashboard View',
      },
      {
        src: '/screenshots/debt-calculator.png',
        sizes: '1280x720',
        type: 'image/png',
        label: 'Debt Calculator Tool',
      },
    ],
    shortcuts: [
      {
        name: 'Debt Calculator',
        short_name: 'Calculator',
        description: 'Calculate your debt payoff strategy',
        url: '/tools/debt-calculator',
        icons: [
          {
            src: '/shortcuts/calculator-96x96.png',
            sizes: '96x96',
          },
        ],
      },
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'View your financial overview',
        url: '/dashboard',
        icons: [
          {
            src: '/shortcuts/dashboard-96x96.png',
            sizes: '96x96',
          },
        ],
      },
    ],
  };
}
