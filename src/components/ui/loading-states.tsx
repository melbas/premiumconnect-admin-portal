
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

interface SkeletonCardsProps {
  count?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn(
      'animate-spin',
      sizeClasses[size],
      className
    )} />
  );
};

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ 
  rows = 5, 
  columns = 4,
  className 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 animate-fade-in" style={{
          animationDelay: `${rowIndex * 100}ms`
        }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonCards: React.FC<SkeletonCardsProps> = ({ 
  count = 6,
  className 
}) => {
  return (
    <div className={cn(
      "grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      className
    )}>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="space-y-3 p-6 border rounded-lg animate-fade-in"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex space-x-2 pt-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const LoadingOverlay: React.FC<{ children: React.ReactNode; isLoading: boolean }> = ({ 
  children, 
  isLoading 
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};
