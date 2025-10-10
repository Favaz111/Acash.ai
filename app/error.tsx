'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service (Sentry, etc.)
    console.error('Application Error:', error);

    // Track error with monitoring service
    if (typeof window !== 'undefined') {
      import('@/lib/monitoring/error-tracker').then(({ errorTracker }) => {
        errorTracker.captureError(error, {
          component: 'ErrorBoundary',
          action: 'page_error',
          metadata: { digest: error.digest },
        });
      });
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full border-2 border-red-200">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-900">عذراً، حدث خطأ غير متوقع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4" dir="rtl">
            <p className="text-sm text-red-800 mb-2 font-semibold">تفاصيل الخطأ:</p>
            <p className="text-sm text-red-700 font-mono break-words">
              {error.message || 'خطأ غير محدد'}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">رقم المرجع: {error.digest}</p>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={reset} className="w-full" size="lg">
              <RefreshCw className="w-5 h-5 ml-2" />
              حاول مرة أخرى
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <Home className="w-5 h-5 ml-2" />
                العودة للصفحة الرئيسية
              </Link>
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" dir="rtl">
            <p className="text-sm text-blue-800">
              💡 <strong>نصيحة:</strong> إذا استمرت المشكلة، جرّب:
            </p>
            <ul className="text-sm text-blue-700 mt-2 mr-6 list-disc space-y-1">
              <li>تحديث الصفحة</li>
              <li>مسح ذاكرة التخزين المؤقت (Cache)</li>
              <li>التواصل مع الدعم الفني</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
