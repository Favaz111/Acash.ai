'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error reporting service
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #fee2e2, #ffffff, #fed7aa)',
            padding: '1rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '32rem',
              width: '100%',
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '2px solid #fecaca',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  width: '5rem',
                  height: '5rem',
                  margin: '0 auto 1rem',
                  background: '#fee2e2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                }}
              >
                ⚠️
              </div>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#7f1d1d',
                  marginBottom: '1rem',
                }}
              >
                عذراً، حدث خطأ خطير
              </h1>
              <p
                style={{
                  color: '#991b1b',
                  marginBottom: '1.5rem',
                }}
              >
                {error.message || 'خطأ غير متوقع في التطبيق'}
              </p>
              {error.digest && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#dc2626',
                    marginBottom: '1.5rem',
                  }}
                >
                  رقم المرجع: {error.digest}
                </p>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <button
                onClick={reset}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                🔄 حاول مرة أخرى
              </button>

              <Link
                href="/"
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  color: '#3b82f6',
                  border: '2px solid #3b82f6',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                🏠 العودة للصفحة الرئيسية
              </Link>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#dbeafe',
                border: '1px solid #93c5fd',
                borderRadius: '0.5rem',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  marginBottom: '0.5rem',
                }}
              >
                <strong>💡 نصيحة:</strong> جرّب تحديث الصفحة أو مسح ذاكرة التخزين المؤقت
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
