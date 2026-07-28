import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4 border border-slate-800 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-44 bg-slate-800/80 rounded-xl" />

      {/* Brand & Title Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-20 bg-slate-800 rounded" />
        <div className="h-4 w-3/4 bg-slate-800 rounded" />
      </div>

      {/* Specs Grid Skeleton */}
      <div className="grid grid-cols-2 gap-2 py-2">
        <div className="h-8 bg-slate-800/60 rounded-lg" />
        <div className="h-8 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Pricing Skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div className="h-6 w-24 bg-slate-800 rounded" />
        <div className="h-8 w-24 bg-slate-800 rounded-xl" />
      </div>
    </div>
  );
};
