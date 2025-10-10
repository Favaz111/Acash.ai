import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

/**
 * مكون Loading موحد للتطبيق
 * يوفر حالة تحميل متسقة في كل مكان
 */
export function Loading({ size = 'md', text, fullScreen = false, className }: LoadingProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      <Loader2
        className={cn('animate-spin text-primary', sizeClasses[size])}
        aria-label="جاري التحميل"
      />
      {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Skeleton loader للمحتوى
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />;
}

/**
 * Card Skeleton
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  );
}

/**
 * Table Skeleton
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

/**
 * Button Loading State
 */
interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
}

export function ButtonLoading({ loading, children }: ButtonLoadingProps) {
  if (loading) {
    return (
      <>
        <Loader2 className="w-4 h-4 animate-spin ml-2" />
        {children}
      </>
    );
  }
  return <>{children}</>;
}
