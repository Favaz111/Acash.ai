'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from '@/i18n/navigation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary لالتقاط الأخطاء في مكونات React
 * ومنع تعطل التطبيق بالكامل
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // تسجيل الخطأ في console أو خدمة مثل Sentry
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // يمكن إرسال الخطأ إلى خدمة مراقبة
    // sendToErrorMonitoring(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  override render() {
    if (this.state.hasError) {
      // استخدام fallback مخصص إذا تم تمريره
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // عرض واجهة خطأ افتراضية
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ غير متوقع</h1>

            <p className="text-gray-600 mb-6">
              نعتذر عن الإزعاج. حدث خطأ في التطبيق ونحن نعمل على حله.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-right mb-6 p-4 bg-red-50 rounded-lg text-sm">
                <summary className="cursor-pointer font-semibold text-red-700 mb-2">
                  تفاصيل الخطأ (Development Mode)
                </summary>
                <div className="mt-2 space-y-2">
                  <p className="font-mono text-xs text-red-600 break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-700 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2"
                variant="primary"
              >
                <RefreshCcw className="w-4 h-4" />
                حاول مرة أخرى
              </Button>

              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher Order Component لتغليف أي مكون بـ Error Boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
