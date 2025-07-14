'use client';

import { Skeleton } from '@/components/ui/skeleton';

// Mobile skeleton component
function CategoryListSkeletonDesktop() {
  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto px-10">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          {/* Navigation Arrows Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        {/* Mobile Carousel Skeleton */}
        <div className="w-full">
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex-1">
                <div className="bg-input rounded-2xl p-6 h-32 flex flex-col items-center justify-center gap-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop skeleton component
function CategoryListSkeletonMobile() {
  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto px-10">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-8 w-48" />
          {/* Navigation Arrows Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        {/* Desktop Carousel Skeleton */}
        <div className="w-full">
          <div className="flex gap-8 overflow-hidden">
            {Array.from({ length: 2 }).map((_, groupIdx) => (
              <div key={groupIdx} className="flex-1 flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, categoryIdx) => (
                  <div key={categoryIdx} className="mb-4 last:mb-0">
                    <div className="bg-input rounded-2xl p-6 h-32 flex flex-col items-center justify-center gap-2">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main skeleton component with conditional rendering
export function CategoryListSkeleton() {
  return (
    <>
      {/* Mobile version - hidden on md and larger screens */}
      <div className="block md:hidden">
        <CategoryListSkeletonMobile />
      </div>
      {/* Desktop version - hidden on screens smaller than md */}
      <div className="hidden md:block">
        <CategoryListSkeletonDesktop />
      </div>
    </>
  );
}
