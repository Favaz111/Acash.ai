import toast, { Toaster } from 'react-hot-toast';
// import type { Toast as HotToast } from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

// ==========================================
// TOAST WRAPPER COMPONENT
// ==========================================

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#fff',
          color: '#1f2937',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '500px',
        },
        // Success
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        // Error
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        // Loading
        loading: {
          duration: Infinity,
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}

// ==========================================
// CUSTOM TOAST FUNCTIONS
// ==========================================

interface ToastOptions {
  duration?: number;
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
}

/**
 * عرض toast نجاح
 */
export function showSuccess(message: string, options?: ToastOptions) {
  const config: any = {
    icon: <CheckCircle2 className="w-5 h-5" />,
  };
  if (options?.duration !== undefined) config.duration = options.duration;
  if (options?.position !== undefined) config.position = options.position;
  return toast.success(message, config);
}

/**
 * عرض toast خطأ
 */
export function showError(message: string, options?: ToastOptions) {
  const config: any = {
    icon: <XCircle className="w-5 h-5" />,
  };
  if (options?.duration !== undefined) config.duration = options.duration;
  if (options?.position !== undefined) config.position = options.position;
  return toast.error(message, config);
}

/**
 * عرض toast تحذير
 */
export function showWarning(message: string, options?: ToastOptions) {
  const config: any = {
    duration: 4000,
    icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
    style: {
      background: '#fff',
      color: '#1f2937',
      borderLeft: '4px solid #f59e0b',
    },
  };
  if (options?.duration !== undefined) config.duration = options.duration;
  if (options?.position !== undefined) config.position = options.position;
  return toast(message, config);
}

/**
 * عرض toast معلومات
 */
export function showInfo(message: string, options?: ToastOptions) {
  const config: any = {
    duration: 4000,
    icon: <Info className="w-5 h-5 text-blue-500" />,
    style: {
      background: '#fff',
      color: '#1f2937',
      borderLeft: '4px solid #3b82f6',
    },
  };
  if (options?.duration !== undefined) config.duration = options.duration;
  if (options?.position !== undefined) config.position = options.position;
  return toast(message, config);
}

/**
 * عرض toast تحميل
 */
export function showLoading(message: string) {
  return toast.loading(message);
}

/**
 * عرض toast مخصص
 */
export function showCustom(message: string, options?: ToastOptions & { icon?: React.ReactNode }) {
  const config: any = {};
  if (options?.duration !== undefined) config.duration = options.duration;
  if (options?.position !== undefined) config.position = options.position;
  if (options?.icon !== undefined) config.icon = options.icon;
  return toast(message, config);
}

/**
 * إخفاء toast معين
 */
export function hideToast(toastId: string) {
  toast.dismiss(toastId);
}

/**
 * إخفاء جميع toasts
 */
export function hideAllToasts() {
  toast.dismiss();
}

/**
 * Promise toast - للعمليات async
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}

// ==========================================
// EXPORT DEFAULT TOAST
// ==========================================

export { toast };
export default {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  custom: showCustom,
  promise: showPromise,
  dismiss: hideToast,
  dismissAll: hideAllToasts,
};
