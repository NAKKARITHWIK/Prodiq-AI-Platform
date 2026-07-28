import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<Props> = ({
  title = 'No products found',
  description = 'Try adjusting your search criteria or resetting filters to see results.',
  onReset,
}) => {
  return (
    <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 space-y-4 max-w-md mx-auto my-8">
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit mx-auto">
        <SearchX className="h-10 w-10" />
      </div>

      <div className="space-y-1 px-6">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-indigo-600/30"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
