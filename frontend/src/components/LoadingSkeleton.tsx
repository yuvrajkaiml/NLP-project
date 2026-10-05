import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 py-2 animate-pulse" aria-label="Translating...">
      <div className="h-5 bg-gradient-to-r from-ink-200 via-ink-100 to-ink-200 dark:from-ink-800 dark:via-ink-700 dark:to-ink-800 rounded-md w-11/12 animate-shimmer bg-[length:200%_100%]"></div>
      <div className="h-5 bg-gradient-to-r from-ink-200 via-ink-100 to-ink-200 dark:from-ink-800 dark:via-ink-700 dark:to-ink-800 rounded-md w-3/4 animate-shimmer bg-[length:200%_100%]"></div>
      <div className="h-5 bg-gradient-to-r from-ink-200 via-ink-100 to-ink-200 dark:from-ink-800 dark:via-ink-700 dark:to-ink-800 rounded-md w-1/2 animate-shimmer bg-[length:200%_100%]"></div>

      <div className="flex items-center space-x-2 pt-3">
        <div className="h-3 w-16 bg-ink-200 dark:bg-ink-800 rounded"></div>
        <div className="h-2 w-32 bg-ink-200 dark:bg-ink-800 rounded-full"></div>
      </div>
    </div>
  );
};
