'use client';

import { usePathname } from '@/i18n/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  locale?: string;
}

// الصفحات التي لا تحتاج Navbar/Footer (صفحات Auth كاملة)
const FULL_PAGE_ROUTES = ['/auth/login', '/auth/register', '/auth/reset-password'];

export function AppLayout({ children, locale = 'ar' }: AppLayoutProps) {
  const pathname = usePathname();

  // Extract path without locale for route matching
  const segments = pathname.split('/').filter(Boolean);
  const pathWithoutLocale = segments.length > 1 ? `/${segments.slice(1).join('/')}` : '/';

  // تحقق إذا كانت الصفحة الحالية تحتاج layout كامل
  const isFullPage = FULL_PAGE_ROUTES.some((route) => pathWithoutLocale.startsWith(route));

  if (isFullPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
