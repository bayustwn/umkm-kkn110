export function NewsCardSkeleton() {
  return (
    <div className="w-full flex flex-row gap-5 items-center min-w-0">
      <div className="h-40 rounded-md w-32 md:w-60 bg-gray-200 animate-pulse flex-shrink-0" />
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse mt-1" />
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="w-full gap-5 mt-10 grid grid-cols-1 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeaturedNewsSkeleton() {
  return (
    <>
      <div className="h-8 bg-gray-200 rounded-md w-48 mt-10 md:mt-20 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {[0, 1].map((i) => (
          <div key={i} className="relative h-90 md:h-full">
            <div className="rounded-lg w-full h-full bg-gray-200 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-full rounded-lg bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 text-white p-4 md:p-5 flex flex-col">
              <div className="h-4 bg-white/20 rounded w-24 animate-pulse mb-2" />
              <div className="h-8 bg-white/20 rounded w-3/4 animate-pulse mb-2" />
              <div className="h-4 bg-white/20 rounded w-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function UmkmCardSkeleton() {
  return (
    <div className="mt-5 flex w-full flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md p-4">
      <div className="relative">
        <div className="w-full h-60 bg-gray-200 rounded-md animate-pulse" />
        <div className="absolute top-3 left-3 bg-gray-300 w-20 h-6 rounded-full animate-pulse" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mt-2" />
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      <div className="my-4">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        <div className="flex flex-row gap-2 mt-3 items-center">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="mt-5 flex flex-row items-center justify-between">
        <div className="flex flex-col items-start">
          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-20 animate-pulse mt-1" />
        </div>
        <div className="bg-gray-200 px-5 py-1 rounded-full w-16 h-8 animate-pulse" />
      </div>
    </div>
  );
}

export function UmkmGridSkeleton({ count = 8, cols = 4 }: { count?: number; cols?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <UmkmCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="w-[15%] hidden md:block md:sticky md:top-5 h-fit">
      <div className="h-6 bg-gray-200 rounded-md w-32 mb-5 animate-pulse" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2" />
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FullPageLoader({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <img src="/icons/loading.svg" alt="Loading" className="w-16 h-16 animate-spin" />
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}
