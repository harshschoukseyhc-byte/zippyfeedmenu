'use client';

import React from 'react';
import { FoodMark } from './FoodMark';

interface VegToggleProps {
  isVegOnly: boolean;
  onToggle: (val: boolean) => void;
  className?: string;
}

export const VegToggle: React.FC<VegToggleProps> = ({
  isVegOnly,
  onToggle,
  className = '',
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isVegOnly}
      aria-label="Filter menu to vegetarian only dishes"
      onClick={() => onToggle(!isVegOnly)}
      className={`group relative inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 rounded-full transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        isVegOnly
          ? 'bg-emerald-700/90 text-white shadow-sm ring-1 ring-emerald-400'
          : 'bg-black/20 hover:bg-black/30 text-white/90 border border-white/20'
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <FoodMark veg={true} size={14} className="bg-white rounded-xs p-[1px]" />
        <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
          Veg only
        </span>
      </div>

      {/* Switch Track & Thumb */}
      <div
        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
          isVegOnly ? 'bg-emerald-400 justify-end' : 'bg-white/30 justify-start'
        }`}
      >
        <span
          className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
            isVegOnly ? 'scale-105' : 'scale-95'
          }`}
        />
      </div>
    </button>
  );
};
