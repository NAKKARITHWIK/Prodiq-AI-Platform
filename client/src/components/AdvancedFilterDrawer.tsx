import React from 'react';
import { MultiFacetFilterParams } from '../types';
import { Filter, X, RefreshCw, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: MultiFacetFilterParams;
  onFilterChange: (newFilters: MultiFacetFilterParams) => void;
  onReset: () => void;
}

export const AdvancedFilterDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) => {
  if (!isOpen) return null;

  const brands = ['All', 'ASUS', 'Apple', 'Dell', 'Lenovo', 'Samsung', 'Sony'];
  const processors = ['All', 'Intel Core i9', 'Apple M3 Max', 'Apple M3 Pro', 'Intel Core i7', 'AMD Ryzen 7'];
  const ramOptions = ['All', '16GB', '32GB', '36GB', '64GB'];
  const categories = ['All', 'LAPTOP', 'SMARTPHONE', 'MONITOR', 'HEADPHONES'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 animate-slideLeft flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Filter className="h-5 w-5" />
              <h2 className="text-base font-bold text-white">Multi-Facet Search & Filter</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onFilterChange({ ...filters, category: cat === 'All' ? undefined : cat })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    (filters.category || 'All') === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Brand</label>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => onFilterChange({ ...filters, brand: b === 'All' ? undefined : b })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    (filters.brand || 'All') === b
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Processor Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Processor / Chipset</label>
            <select
              value={filters.processor || 'All'}
              onChange={(e) => onFilterChange({ ...filters, processor: e.target.value === 'All' ? undefined : e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {processors.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* RAM Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">RAM Capacity</label>
            <div className="flex flex-wrap gap-2">
              {ramOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => onFilterChange({ ...filters, ram: r === 'All' ? undefined : r })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    (filters.ram || 'All') === r
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Max Budget Price: ₹{(filters.maxPrice || 250000).toLocaleString('en-IN')}</label>
            <input
              type="range"
              min="20000"
              max="350000"
              step="10000"
              value={filters.maxPrice || 250000}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Min Rating */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Minimum Rating: {filters.minRating || 4.0}★</label>
            <input
              type="range"
              min="3.0"
              max="5.0"
              step="0.1"
              value={filters.minRating || 4.0}
              onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center space-x-3">
          <button
            onClick={onReset}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
