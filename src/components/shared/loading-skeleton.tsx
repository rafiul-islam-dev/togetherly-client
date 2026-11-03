
type EventCardSkeletonProps = {
  count?: number;
};

export function EventCardSkeleton({
  count = 6,
}: EventCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-border bg-card"
        >
          {/* Image Skeleton */}
          <div className="h-52 w-full animate-pulse bg-muted" />

          <div className="space-y-4 p-5">
            {/* Category */}
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />

            {/* Title */}
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            </div>

            {/* Location and Date */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>

            {/* Button */}
            <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="space-y-3">
        <div className="h-9 w-64 max-w-full animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      </div>

      {/* Content */}
      <EventCardSkeleton count={6} />
    </div>
  );
}
