import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[60vh] p-8 flex flex-col items-center justify-center space-y-8 max-w-7xl mx-auto">
      {/* Hero Skeleton Area */}
      <div className="w-full flex flex-col items-center space-y-4 mb-8">
        <Skeleton className="h-12 w-3/4 max-w-2xl rounded-lg" />
        <Skeleton className="h-6 w-1/2 max-w-lg rounded-lg" />
      </div>

      {/* Grid of Skeleton Cards for Content (e.g. Packages, Destinations) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md mt-4" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
