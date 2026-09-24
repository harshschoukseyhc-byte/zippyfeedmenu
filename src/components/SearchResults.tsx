'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { FoodMark } from './FoodMark';

export interface SearchResultItem extends MenuItem {
  sectionName: string;
  sectionId: string;
  groupName: string;
}

interface SearchResultsProps {
  query: string;
  results: SearchResultItem[];
  onSelectDish?: (item: MenuItem) => void;
  onSelectVariant?: (item: MenuItem, variantLabel: string, price: number) => void;
  trayQuantities?: Record<string, number>;
  onSelectSuggestion: (term: string) => void;
  onClear: () => void;
}

const POPULAR_SUGGESTIONS = ['Momo', 'Pizza', 'Burger', 'Paneer', 'Noodles', 'Shake', 'Cold Coffee', 'Biryani'];

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  onSelectDish,
  onSelectVariant,
  trayQuantities,
  onSelectSuggestion,
  onClear,
}) => {
  if (results.length === 0) {
    return (
      <div className="py-12 px-4 text-center max-w-md mx-auto">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zippy-paperDarker border border-zippy-paperBorder flex items-center justify-center text-xl">
          🔍
        </div>
        <h3 className="font-serif font-bold text-lg text-zippy-maroon mb-1">
          Koi dish nahi mili
        </h3>
        <p className="text-xs text-zippy-muted mb-4">
          &ldquo;{query}&rdquo; naam se koi item nahi mila. Spelling check karein ya neeche diye gaye popular items dekhein:
        </p>

        {/* Helpful suggestion chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {POPULAR_SUGGESTIONS.map((term) => (
            <button
              key={term}
              onClick={() => onSelectSuggestion(term)}
              className="min-h-[36px] px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-zippy-paperBorder hover:border-zippy-red hover:text-zippy-red transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        <button
          onClick={onClear}
          className="inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-full text-xs font-semibold bg-zippy-red text-white hover:bg-zippy-maroon transition-colors"
        >
          Pura Menu Dekhein
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 space-y-2">
      <div className="text-xs text-zippy-muted px-1 uppercase tracking-wider font-semibold">
        Search Results ({results.length})
      </div>
      <div className="divide-y divide-zippy-paperBorder bg-white/70 rounded-2xl border border-zippy-paperBorder shadow-xs overflow-hidden">
        {results.map((item) => {
          const qty = trayQuantities?.[item.id] || 0;
          const isUnavailable = Boolean(item.unavailable);

          return (
            <div
              key={item.id}
              onClick={() => !isUnavailable && onSelectDish && onSelectDish(item)}
              className="p-3.5 hover:bg-black/[0.02] transition-colors flex items-start justify-between cursor-pointer"
              role="article"
              aria-label={`${item.name}, ${item.veg ? 'Vegetarian' : 'Non-Vegetarian'}, ${
                item.price ? `₹${item.price}` : 'variants available'
              }`}
            >
              <div className="flex items-start gap-2.5 flex-1 pr-3 min-w-0">
                <div className="pt-0.5">
                  <FoodMark veg={item.veg} size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-sans font-semibold text-sm text-zippy-ink leading-snug">
                      {item.name}
                    </h4>
                    {isUnavailable ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">
                        Aaj nahi hai
                      </span>
                    ) : qty > 0 ? (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-zippy-red/10 text-zippy-red tracking-tight">
                        ✓ {qty} in list
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-zippy-muted">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-zippy-paperDarker border border-zippy-paperBorder text-zippy-ink/70 font-medium">
                      {item.sectionName}
                    </span>
                    <span>•</span>
                    <span>{item.groupName}</span>
                  </div>
                  {item.desc && (
                    <p className="text-xs text-zippy-muted leading-relaxed mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 text-right pt-0.5">
                {item.variants ? (
                  <div className="flex flex-col items-end gap-1">
                    {Object.entries(item.variants).map(([label, price]) => (
                      <button
                        key={label}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isUnavailable && onSelectVariant) {
                            onSelectVariant(item, label, price);
                          } else if (!isUnavailable && onSelectDish) {
                            onSelectDish(item);
                          }
                        }}
                        className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-50 border border-zippy-paperBorder hover:border-zippy-red hover:bg-white text-xs font-sans group/var"
                      >
                        <span className="text-[11px] font-medium text-zippy-ink/70">{label}</span>
                        <span className="font-condensed font-bold text-sm text-zippy-red">
                          ₹{price}
                        </span>
                        <span className="text-[10px] font-bold text-zippy-red ml-0.5">+</span>
                      </button>
                    ))}
                  </div>
                ) : typeof item.price === 'number' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-condensed font-bold text-base text-zippy-red">
                      ₹{item.price}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isUnavailable && onSelectDish) {
                          onSelectDish(item);
                        }
                      }}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-zippy-red hover:text-white text-zippy-red border border-zippy-paperBorder flex items-center justify-center font-bold text-sm transition-all"
                      aria-label={`Add ${item.name} to list`}
                    >
                      +
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
