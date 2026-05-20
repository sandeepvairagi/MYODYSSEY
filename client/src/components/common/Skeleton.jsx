export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`} />
);

export const DestinationCardSkeleton = () => (
  <div className="card">
    <Skeleton className="h-56 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3" />
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <DestinationCardSkeleton key={i} />
    ))}
  </div>
);
