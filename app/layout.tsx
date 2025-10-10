import type { Metadata } from 'next';
import './globals.css';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { ToastProvider } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: {
    default: 'Acash.ai - Your Smart Financial Assistant | مساعدك المالي الذكي',
    template: '%s | Acash.ai',
  },
  description:
    'Smart financial platform empowering you to achieve financial independence through AI-powered tools and personal financial assistant. منصة مالية ذكية تمكّنك من تحقيق الاستقلال المالي من خلال أدوات ذكية ومساعد مالي شخصي',
  keywords: [
    'financial management',
    'إدارة مالية',
    'financial planning',
    'تخطيط مالي',
    'AI financial advisor',
    'ذكاء اصطناعي',
    'personal finance',
    'مساعد مالي',
    'debt management',
    'إدارة الديون',
    'budget planning',
    'تخطيط الميزانية',
    'financial independence',
    'استقلال مالي',
    'Saudi Arabia',
    'السعودية',
    'Gulf',
    'الخليج',
    'MENA',
  ],
  authors: [{ name: 'Acash.ai Team' }],
  creator: 'Acash.ai',
  publisher: 'Acash.ai',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://acash.ai'),
  alternates: {
    canonical: '/',
    languages: {
      'ar-SA': '/ar',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    url: 'https://acash.ai',
    siteName: 'Acash.ai',
    title: 'Acash.ai - Your Smart Financial Assistant | مساعدك المالي الذكي',
    description:
      'Smart financial platform empowering you to achieve financial independence through AI-powered tools. منصة مالية ذكية تمكّنك من تحقيق الاستقلال المالي',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Acash.ai - Smart Financial Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Acash.ai - Your Smart Financial Assistant',
    description:
      'Smart financial platform empowering you to achieve financial independence through AI-powered tools',
    images: ['/twitter-image.png'],
    creator: '@acash_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Acash.ai',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Acash.ai',
    alternateName: ['اكاش', 'Acash'],
    url: 'https://acash.ai',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    description:
      'Smart financial platform empowering you to achieve financial independence through AI-powered tools and personal financial assistant',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'SAR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    author: {
      '@type': 'Organization',
      name: 'Acash.ai',
      url: 'https://acash.ai',
      logo: 'https://acash.ai/logo.png',
      sameAs: [
        'https://twitter.com/acash_ai',
        'https://linkedin.com/company/acash-ai',
        'https://facebook.com/acash.ai',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'support@acash.ai',
        availableLanguage: ['Arabic', 'English'],
      },
    },
    featureList: [
      'AI-powered financial advice',
      'Debt management and payoff strategies',
      'Budget planning and tracking',
      'Financial goal setting',
      'Personalized financial assessment',
      'Multi-currency support',
      'Islamic finance compliant',
    ],
    inLanguage: ['ar-SA', 'en-US'],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
