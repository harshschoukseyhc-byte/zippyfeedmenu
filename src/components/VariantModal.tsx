'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { FoodMark } from './FoodMark';

interface VariantModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSelectVariant: (item: MenuItem, variantLabel: string, price: number) => void;
}

export const VariantModal: React.FC<VariantModalProps> = ({
  item,
  onClose,
  onSelectVariant,
}) => {
  if (!item || !item.variants) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="variant-modal-title"
    >
      <div
        className="bg-zippy-paper w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 border border-zippy-paperBorder"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-zippy-paperBorder">
          <div className="flex items-start gap-2.5">
            <div className="pt-0.5">
              <FoodMark veg={item.veg} size={16} />
            </div>
            <div>
              <h3 id="variant-modal-title" className="font-serif font-bold text-base text-zippy-ink">
                {item.name}
              </h3>
              <p className="text-xs text-zippy-muted mt-0.5">Select option to add to your list</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors"
            aria-label="Close variant selector"
          >
            ✕
          </button>
        </div>

        {/* Variants List */}
        <div className="py-4 space-y-2.5">
          {Object.entries(item.variants).map(([label, price]) => (
            <button
              key={label}
              onClick={() => {
                onSelectVariant(item, label, price);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white border border-zippy-paperBorder hover:border-zippy-red hover:bg-red-50/20 active:scale-[0.99] transition-all min-h-[52px]"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-zippy-ink">{label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-condensed font-bold text-lg text-zippy-red">
                  ₹{price}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zippy-red text-white text-xs font-semibold">
                  + Add
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
