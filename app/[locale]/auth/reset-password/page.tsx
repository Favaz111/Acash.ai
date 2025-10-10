'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { resetPassword } from '@/lib/firebase/auth';
import { showSuccess, showError } from '@/components/ui/toast';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
      showSuccess('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {success ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">تم إرسال الرابط!</h3>
                <p className="text-gray-600 mb-6">
                  تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور
                </p>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-primary-trust hover:text-primary-innovation transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-trust focus:border-transparent transition-all outline-none"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isValidEmail(email)}
                className="w-full px-6 py-3 gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الإرسال...
                  </span>
                ) : (
                  'إرسال رابط إعادة التعيين'
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-trust transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>لم تتلق الرابط؟ تحقق من مجلد البريد المزعج أو حاول مرة أخرى بعد دقيقة</p>
        </div>
      </div>
    </div>
  );
}
