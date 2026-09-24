'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  resultCount,
  totalCount,
}) => {
  return (
    <div className="relative px-4 py-3 bg-zippy-paper">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-zippy-muted pointer-events-none">
          <Search size={18} aria-hidden="true" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search 329 dishes (e.g. Pizza, Momo, Paneer)..."
          className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-white/90 border border-zippy-paperBorder rounded-xl text-sm text-zippy-ink placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-zippy-red focus:border-transparent transition-all shadow-xs"
          aria-label="Search dishes across menu"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2.5 p-2 text-stone-400 hover:text-zippy-ink min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
            aria-label="Clear search input"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {value && typeof resultCount === 'number' && (
        <div className="flex items-center justify-between text-xs text-zippy-muted mt-2 px-1">
          <span>
            Showing <strong className="text-zippy-ink">{resultCount}</strong> of{' '}
            {totalCount} dishes
          </span>
          <button
            onClick={() => onChange('')}
            className="text-zippy-red hover:underline text-xs font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};
