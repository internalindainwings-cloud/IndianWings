import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', style, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-300 dark:bg-gray-700 ${className}`}
      style={{ animationDuration: '3s', ...style }}
      {...props}
    />
  );
}
