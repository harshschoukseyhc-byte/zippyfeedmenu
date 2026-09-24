'use client';

import React from 'react';
import { PRICE_TIERS } from '@/lib/price-utils';

interface PriceFilterProps {
  selectedMaxPrice: number | null;
  onSelectPrice: (maxPrice: number | null) => void;
  counts: Record<number, number>;
  totalVisible: number;
  isVegOnly: boolean;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  selectedMaxPrice,
  onSelectPrice,
  counts,
  totalVisible,
  isVegOnly,
}) => {
  return (
    <div className="w-full px-4 pt-1 pb-3" role="region" aria-label="Price Filter">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zippy-muted">
            Budget Filters
          </span>
          <span className="text-[10px] text-zippy-gold">✦</span>
        </div>

        {selectedMaxPrice !== null && (
          <button
            onClick={() => onSelectPrice(null)}
            className="text-[11px] font-semibold text-zippy-red hover:underline flex items-center gap-1 min-h-[32px] px-1"
          >
            <span>Reset filter</span>
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" role="toolbar" aria-label="Price ceiling options">
        {PRICE_TIERS.map((tier) => {
          const isActive = selectedMaxPrice === tier.maxPrice;
          const count = counts[tier.maxPrice] ?? 0;

          return (
            <button
              key={tier.id}
              onClick={() => {
                if (isActive) {
                  onSelectPrice(null); // Deselect on second tap
                } else {
                  onSelectPrice(tier.maxPrice);
                }
              }}
              aria-pressed={isActive}
              className={`flex-1 min-w-[100px] min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-between border ${
                isActive
                  ? 'bg-zippy-red text-white border-zippy-red shadow-sm'
                  : 'bg-white/90 text-zippy-ink/90 border-zippy-paperBorder hover:border-zippy-gold/60 active:scale-[0.98]'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{tier.label}</span>
                {isActive && <span className="text-[10px] ml-0.5 opacity-80" aria-hidden="true">✕</span>}
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-100 text-zippy-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {selectedMaxPrice !== null && (
        <div className="mt-2 flex items-center justify-between bg-amber-50/90 border border-amber-200/70 px-3 py-1.5 rounded-lg text-xs text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">Under ₹{selectedMaxPrice}:</span>
            <span>
              {totalVisible} {isVegOnly ? 'veg dishes' : 'dishes'} available
            </span>
          </div>
          <button
            onClick={() => onSelectPrice(null)}
            className="text-zippy-red font-bold text-[11px] underline ml-2"
          >
            Show all
          </button>
        </div>
      )}
    </div>
  );
};
