/**
 * SEO Metadata Utilities
 * دوال مساعدة لتحسين محركات البحث
 */

import { type Metadata } from 'next';
import { type Locale } from '@/i18n/config';

const APP_NAME = 'Acash.ai';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://acash.ai';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  locale?: Locale;
  type?: 'website' | 'article';
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generate comprehensive metadata for SEO
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = `${APP_URL}/og-image.png`,
    locale = 'ar',
    type = 'website',
    noIndex = false,
    canonical,
  } = config;

  const fullTitle = `${title} | ${APP_NAME}`;
  const localeCode = locale === 'ar' ? 'ar_SA' : 'en_US';

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      type,
      locale: localeCode,
      url: canonical || `${APP_URL}/${locale}`,
      siteName: APP_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@acash_ai',
      site: '@acash_ai',
    },

    // Robots
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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

    // Alternates
    alternates: {
      canonical: canonical || `${APP_URL}/${locale}`,
      languages: {
        'ar-SA': `${APP_URL}/ar`,
        'en-US': `${APP_URL}/en`,
      },
    },

    // Verification
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },

    // Additional
    category: 'Finance',
    applicationName: APP_NAME,
  };
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    description: 'منصة التخطيط المالي الذكية المدعومة بالذكاء الاصطناعي',
    sameAs: [
      'https://twitter.com/acash_ai',
      'https://facebook.com/acash.ai',
      'https://linkedin.com/company/acash-ai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+966-XX-XXX-XXXX',
      contactType: 'Customer Service',
      availableLanguage: ['Arabic', 'English'],
    },
  };
}

/**
 * Generate JSON-LD structured data for Product/Service
 */
export function generateProductSchema(config: {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  locale?: Locale;
}) {
  const { name, description, price, currency = 'SAR', locale = 'ar' } = config;

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceRange: '0-49 SAR',
    },
  };

  if (price) {
    schema.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
    };
  }

  return schema;
}

/**
 * Generate JSON-LD structured data for Article/Blog Post
 */
export function generateArticleSchema(config: {
  title: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  locale?: Locale;
}) {
  const { title, description, image, author, datePublished, dateModified, locale = 'ar' } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/logo.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-US',
  };
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for Breadcrumbs
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * SEO Keywords for different pages
 */
export const SEO_KEYWORDS = {
  ar: {
    home: [
      'تخطيط مالي',
      'إدارة مالية',
      'ميزانية شخصية',
      'سداد الديون',
      'أهداف مالية',
      'ذكاء اصطناعي',
      'Acash.ai',
      'السعودية',
    ],
    dashboard: ['لوحة تحكم مالية', 'تتبع المصروفات', 'تحليل مالي', 'صحة مالية'],
    tools: ['حاسبة الديون', 'حاسبة الميزانية', 'حاسبة الزكاة', 'صندوق الطوارئ'],
    pricing: ['أسعار', 'باقات الاشتراك', 'Premium', 'مجاني'],
  },
  en: {
    home: [
      'financial planning',
      'personal finance',
      'budgeting',
      'debt management',
      'financial goals',
      'AI',
      'Acash.ai',
      'Saudi Arabia',
    ],
    dashboard: [
      'financial dashboard',
      'expense tracking',
      'financial analysis',
      'financial health',
    ],
    tools: ['debt calculator', 'budget calculator', 'zakat calculator', 'emergency fund'],
    pricing: ['pricing', 'subscription plans', 'Premium', 'free'],
  },
};

/**
 * Generate sitemap URL entry
 */
export interface SitemapURL {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: {
    languages?: Record<string, string>;
  };
}

export function generateSitemapURLs(): SitemapURL[] {
  const baseUrls = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: 'dashboard', changeFrequency: 'hourly' as const, priority: 0.9 },
    { path: 'tools', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: 'pricing', changeFrequency: 'monthly' as const, priority: 0.9 },
    { path: 'about', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: 'contact', changeFrequency: 'monthly' as const, priority: 0.6 },
  ];

  const urls: SitemapURL[] = [];

  baseUrls.forEach(({ path, changeFrequency, priority }) => {
    urls.push({
      url: `${APP_URL}/ar/${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          'ar-SA': `${APP_URL}/ar/${path}`,
          'en-US': `${APP_URL}/en/${path}`,
        },
      },
    });
  });

  return urls;
}
