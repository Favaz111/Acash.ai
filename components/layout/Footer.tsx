'use client';

import { Link } from '@/i18n/navigation';
import { Sparkles, Mail, Twitter, Linkedin, Facebook } from 'lucide-react';

interface FooterProps {
  locale?: string;
  translations?: {
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    pricing: string;
    tools: string;
    dashboard: string;
    tagline: string;
    copyright: string;
    company: string;
    product: string;
    legal: string;
  };
}

export function Footer({ locale = 'ar', translations }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const t = translations || {
    about: locale === 'ar' ? 'عن التطبيق' : 'About',
    contact: locale === 'ar' ? 'تواصل معنا' : 'Contact',
    privacy: locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
    terms: locale === 'ar' ? 'شروط الخدمة' : 'Terms of Service',
    pricing: locale === 'ar' ? 'الأسعار' : 'Pricing',
    tools: locale === 'ar' ? 'الأدوات المالية' : 'Financial Tools',
    dashboard: locale === 'ar' ? 'لوحة التحكم' : 'Dashboard',
    tagline:
      locale === 'ar'
        ? 'نحو استقرار مالي وبناء ثروة ذكية'
        : 'Towards financial stability and smart wealth building',
    copyright:
      locale === 'ar'
        ? `© ${currentYear} Acash.ai - جميع الحقوق محفوظة`
        : `© ${currentYear} Acash.ai - All rights reserved`,
    company: locale === 'ar' ? 'الشركة' : 'Company',
    product: locale === 'ar' ? 'المنتج' : 'Product',
    legal: locale === 'ar' ? 'قانوني' : 'Legal',
  };

  const footerLinks = {
    product: [
      { href: '/dashboard', label: t.dashboard },
      { href: '/tools', label: t.tools },
      { href: '/pricing', label: t.pricing },
    ],
    company: [
      { href: '/about', label: t.about },
      { href: '/contact', label: t.contact },
    ],
    legal: [
      { href: '/privacy-policy', label: t.privacy },
      { href: '/terms-of-service', label: t.terms },
    ],
  };

  const socialLinks = [
    {
      icon: Twitter,
      href: 'https://twitter.com/acash_ai',
      label: 'Twitter',
      color: 'hover:text-blue-400',
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/company/acash-ai',
      label: 'LinkedIn',
      color: 'hover:text-blue-600',
    },
    {
      icon: Facebook,
      href: 'https://facebook.com/acash.ai',
      label: 'Facebook',
      color: 'hover:text-blue-500',
    },
    {
      icon: Mail,
      href: 'mailto:support@acash.ai',
      label: 'Email',
      color: 'hover:text-green-500',
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
                Acash.ai
              </span>
            </Link>
            <p className="text-sm text-gray-600 mb-4">{t.tagline}</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 text-gray-600 ${social.color} transition-colors rounded-lg hover:bg-white`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.product}</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-trust transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.company}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-trust transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t.legal}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-primary-trust transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
