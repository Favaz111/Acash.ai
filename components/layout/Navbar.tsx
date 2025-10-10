'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { Sparkles, Menu, X, Globe, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { logoutUser } from '@/lib/firebase/auth';

interface NavbarProps {
  locale?: string;
  translations?: {
    home: string;
    dashboard: string;
    tools: string;
    pricing: string;
    login: string;
    register: string;
    logout: string;
    profile: string;
    settings: string;
  };
}

export function Navbar({ locale = 'ar', translations }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  const t = translations || {
    home: locale === 'ar' ? 'الرئيسية' : 'Home',
    dashboard: locale === 'ar' ? 'لوحة التحكم' : 'Dashboard',
    tools: locale === 'ar' ? 'الأدوات' : 'Tools',
    pricing: locale === 'ar' ? 'الأسعار' : 'Pricing',
    login: locale === 'ar' ? 'تسجيل الدخول' : 'Login',
    register: locale === 'ar' ? 'ابدأ مجاناً' : 'Get Started',
    logout: locale === 'ar' ? 'تسجيل الخروج' : 'Logout',
    profile: locale === 'ar' ? 'الملف الشخصي' : 'Profile',
    settings: locale === 'ar' ? 'الإعدادات' : 'Settings',
  };

  const isRTL = locale === 'ar';

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale = segments.length > 1 ? `/${segments.slice(1).join('/')}` : '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navLinks = user
    ? [
        { href: '/dashboard', label: t.dashboard },
        { href: '/tools', label: t.tools },
      ]
    : [
        { href: '/', label: t.home },
        { href: '/tools', label: t.tools },
      ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
              Acash.ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary-trust'
                    : 'text-gray-700 hover:text-primary-trust'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-600 hover:text-primary-trust transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Switch language"
            >
              <Globe className="w-5 h-5" />
            </button>

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-trust to-primary-innovation flex items-center justify-center text-white font-semibold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div
                      className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20`}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.displayName || t.profile}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        {t.profile}
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        {t.settings}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.logout}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href={`/auth/login?returnTo=${encodeURIComponent(pathname)}`}
                  className="text-sm font-medium text-gray-700 hover:text-primary-trust transition-colors"
                >
                  {t.login}
                </Link>
                <Link
                  href={`/auth/register?returnTo=${encodeURIComponent(pathname)}`}
                  className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  {t.register}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-blue-50 text-primary-trust'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-200 my-2" />

              {user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || t.profile}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    {t.profile}
                  </Link>
                  <Link
                    href="/settings"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    {t.settings}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/auth/login?returnTo=${encodeURIComponent(pathname)}`}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.login}
                  </Link>
                  <Link
                    href={`/auth/register?returnTo=${encodeURIComponent(pathname)}`}
                    className="mx-4 px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t.register}
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {locale === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
