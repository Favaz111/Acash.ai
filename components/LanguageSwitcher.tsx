'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';

/**
 * Language Switcher Component
 * مكون تبديل اللغة مع دعم RTL/LTR - نسخة مبسطة
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    // Replace locale prefix only (no concatenation)
    const segments = pathname.split('/').filter(Boolean);

    // Build new path by replacing first segment
    const pathWithoutLocale = segments.slice(1).join('/');
    const newPath = `/${newLocale}${pathWithoutLocale ? '/' + pathWithoutLocale : ''}`;

    // Set locale cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

    // Navigate to new locale (replace to avoid history stacking)
    router.replace(newPath);

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 hover:bg-gray-100 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <span className="text-lg">{localeFlags[locale]}</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className="flex items-center justify-between w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{localeFlags[loc]}</span>
                <span>{localeNames[loc]}</span>
              </span>
              {loc === locale && <Check className="w-4 h-4 text-green-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Language Switcher for Mobile
 * نسخة مبسطة للجوال
 */
export function LanguageSwitcherMobile() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Replace locale prefix only (no concatenation)
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale = segments.slice(1).join('/');
    const newPath = `/${newLocale}${pathWithoutLocale ? '/' + pathWithoutLocale : ''}`;

    // Set locale cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

    // Navigate to new locale (replace to avoid history stacking)
    router.replace(newPath);
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t">
      <Globe className="w-5 h-5 text-gray-600" />
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value as Locale)}
        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeFlags[loc]} {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
