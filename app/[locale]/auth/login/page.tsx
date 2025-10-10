'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Sparkles, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginWithGoogle, sendMagicLink } from '@/lib/firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Get returnTo from query params
  const getReturnUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('returnTo') || '/dashboard';
    }
    return '/dashboard';
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      const returnUrl = getReturnUrl();
      router.replace(returnUrl);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في تسجيل الدخول بجوجل');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendMagicLink(email);
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في إرسال رابط الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary-trust to-primary-innovation bg-clip-text text-transparent">
            Acash.ai
          </span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              أهلاً بعودتك! سجّل دخولك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            {magicLinkSent ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">تحقق من بريدك الإلكتروني</h3>
                <p className="text-gray-600 text-sm mb-4">
                  أرسلنا لك رابط تسجيل الدخول إلى {email}
                </p>
                <Button variant="outline" onClick={() => setMagicLinkSent(false)}>
                  العودة إلى تسجيل الدخول
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Google Login */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  تسجيل الدخول بحساب جوجل
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">أو</span>
                  </div>
                </div>

                {/* Magic Link */}
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <Input
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                    <Mail className="w-4 h-4 ml-2" />
                    {loading ? 'جاري الإرسال...' : 'أرسل رابط تسجيل الدخول'}
                  </Button>
                </form>

                {/* Additional Links */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <Link
                      href="/auth/reset-password"
                      className="text-sm text-primary-trust hover:underline"
                    >
                      نسيت كلمة السر؟
                    </Link>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    ليس لديك حساب؟{' '}
                    <Link
                      href="/auth/register"
                      className="text-primary-trust font-semibold hover:underline"
                    >
                      إنشاء حساب جديد
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
