import { cn } from '@/lib/utils';

// ==========================================
// BASE SKELETON COMPONENT
// ==========================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} {...props} />;
}

// ==========================================
// SKELETON VARIANTS
// ==========================================

/**
 * Skeleton Line - للنصوص
 */
export function SkeletonLine({
  className,
  width = 'w-full',
  ...props
}: SkeletonProps & { width?: string }) {
  return <Skeleton className={cn('h-4', width, className)} {...props} />;
}

/**
 * Skeleton Circle - للصور الدائرية
 */
export function SkeletonCircle({
  className,
  size = 'w-12 h-12',
  ...props
}: SkeletonProps & { size?: string }) {
  return <Skeleton className={cn('rounded-full', size, className)} {...props} />;
}

/**
 * Skeleton Card - للكروت
 */
export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('bg-white rounded-xl border border-gray-200 p-6 space-y-4', className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <SkeletonCircle size="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-1/3" />
          <SkeletonLine width="w-1/2" className="h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLine width="w-4/5" />
      </div>
    </div>
  );
}

/**
 * Skeleton Button
 */
export function SkeletonButton({
  className,
  width = 'w-24',
  ...props
}: SkeletonProps & { width?: string }) {
  return <Skeleton className={cn('h-10 rounded-lg', width, className)} {...props} />;
}

/**
 * Skeleton Avatar - للصور الشخصية
 */
export function SkeletonAvatar({
  className,
  size = 'w-24 h-24',
  ...props
}: SkeletonProps & { size?: string }) {
  return <Skeleton className={cn('rounded-full', size, className)} {...props} />;
}

// ==========================================
// COMPLEX SKELETONS
// ==========================================

/**
 * Skeleton Dashboard Card
 */
export function SkeletonDashboardCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonCircle size="w-12 h-12" />
            <div className="space-y-2">
              <SkeletonLine width="w-32" />
              <SkeletonLine width="w-24" className="h-3" />
            </div>
          </div>
          <SkeletonButton width="w-20" />
        </div>

        {/* Content */}
        <div className="space-y-3 pt-4">
          <SkeletonLine />
          <SkeletonLine width="w-5/6" />
          <SkeletonLine width="w-4/6" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-2">
            <SkeletonLine width="w-16" className="h-3" />
            <SkeletonLine width="w-24" className="h-6" />
          </div>
          <div className="space-y-2">
            <SkeletonLine width="w-16" className="h-3" />
            <SkeletonLine width="w-24" className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Profile Header
 */
export function SkeletonProfileHeader() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex items-center gap-6">
        <SkeletonAvatar size="w-24 h-24" />
        <div className="flex-1 space-y-3">
          <SkeletonLine width="w-48" className="h-6" />
          <SkeletonLine width="w-64" className="h-4" />
          <div className="flex gap-3 pt-2">
            <SkeletonButton width="w-32" />
            <SkeletonButton width="w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Table Row
 */
export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100">
      <SkeletonCircle size="w-8 h-8" />
      <SkeletonLine width="w-32" />
      <SkeletonLine width="w-24" />
      <SkeletonLine width="w-16" className="ml-auto" />
    </div>
  );
}

/**
 * Skeleton List - قائمة من العناصر
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton Stats Grid
 */
export function SkeletonStatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <SkeletonCircle size="w-10 h-10" />
            <SkeletonLine width="w-24" />
          </div>
          <SkeletonLine width="w-32" className="h-8" />
          <SkeletonLine width="w-20" className="h-3 mt-2" />
        </div>
      ))}
    </div>
  );
}

// Export all
export default Skeleton;
