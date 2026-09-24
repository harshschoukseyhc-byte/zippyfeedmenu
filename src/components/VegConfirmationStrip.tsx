'use client';

import React from 'react';
import { FoodMark } from './FoodMark';

interface VegConfirmationStripProps {
  isVegOnly: boolean;
  itemCount: number;
  onDisable: () => void;
}

export const VegConfirmationStrip: React.FC<VegConfirmationStripProps> = ({
  isVegOnly,
  itemCount,
  onDisable,
}) => {
  if (!isVegOnly) return null;

  return (
    <aside
      aria-live="polite"
      className="bg-emerald-50/95 backdrop-blur-sm border-b border-emerald-200/90 text-emerald-950 px-4 py-2 text-xs transition-all duration-300 shadow-2xs"
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FoodMark veg={true} size={15} />
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-emerald-900">
              Showing pure veg only
            </span>
            <span className="text-[11px] text-emerald-700">
              ({itemCount} dishes)
            </span>
          </div>
        </div>

        <button
          onClick={onDisable}
          className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline px-1 py-1 rounded min-h-[36px] flex items-center"
          aria-label="Turn off veg only filter"
        >
          Show all
        </button>
      </div>
    </aside>
  );
};
