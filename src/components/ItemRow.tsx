import React from 'react';
import { MenuItem } from '@/types/menu';
import { FoodMark } from './FoodMark';

interface ItemRowProps {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
  onSelectVariant?: (item: MenuItem, variantLabel: string, price: number) => void;
  quantityInTray?: number;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  onSelect,
  onSelectVariant,
  quantityInTray = 0,
}) => {
  const isUnavailable = Boolean(item.unavailable);

  return (
    <div
      onClick={() => !isUnavailable && onSelect && onSelect(item)}
      className={`group relative flex items-start justify-between py-3 px-2 rounded-xl transition-colors w-full min-w-0 ${
        isUnavailable
          ? 'opacity-60 cursor-not-allowed bg-stone-100/50'
          : 'hover:bg-black/[0.02] cursor-pointer'
      }`}
      role="article"
      data-item-row="true"
      aria-label={`${item.name}, ${item.veg ? 'Vegetarian' : 'Non-Vegetarian'}, ${
        item.price ? `₹${item.price}` : 'variants available'
      }${quantityInTray > 0 ? `, ${quantityInTray} in your list` : ''}`}
    >
      {/* Left Column: Food Mark + Details */}
      <div className="flex items-start gap-2 flex-1 min-w-0 pr-2">
        <div className="pt-0.5 flex-shrink-0">
          <FoodMark veg={item.veg} size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4
              className={`font-sans font-semibold text-sm leading-snug tracking-tight break-words ${
                isUnavailable ? 'text-stone-500 line-through decoration-stone-400' : 'text-zippy-ink'
              }`}
            >
              {item.name}
            </h4>
            {isUnavailable ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700 tracking-wide uppercase flex-shrink-0">
                Aaj nahi hai
              </span>
            ) : quantityInTray > 0 ? (
              <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-zippy-red/10 text-zippy-red tracking-tight flex-shrink-0">
                ✓ {quantityInTray} in list
              </span>
            ) : null}
          </div>

          {item.desc && (
            <p className="text-xs text-zippy-muted leading-relaxed mt-0.5 line-clamp-2 break-words">
              {item.desc}
            </p>
          )}
        </div>
      </div>

      {/* Right Column: Pricing & Add affordance */}
      <div className="flex-shrink-0 text-right pt-0.5 pl-2">
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
                  } else if (!isUnavailable && onSelect) {
                    onSelect(item);
                  }
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-stone-50 border border-zippy-paperBorder hover:border-zippy-red hover:bg-white active:scale-95 transition-all text-xs font-sans group/var"
                aria-label={`Add ${label} variant at ₹${price}`}
              >
                <span className="text-[11px] font-medium text-zippy-ink/80">{label}</span>
                <span className="font-condensed font-bold text-sm text-zippy-red tracking-tight">
                  ₹{price}
                </span>
                <span className="text-[10px] font-bold text-zippy-red ml-0.5">+</span>
              </button>
            ))}
          </div>
        ) : typeof item.price === 'number' ? (
          <div className="flex items-center gap-2">
            <span className="font-condensed font-bold text-base sm:text-lg text-zippy-red tracking-tight whitespace-nowrap">
              ₹{item.price}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!isUnavailable && onSelect) {
                  onSelect(item);
                }
              }}
              className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-zippy-red hover:text-white text-zippy-red border border-zippy-paperBorder flex items-center justify-center font-bold text-sm transition-all active:scale-95"
              aria-label={`Add ${item.name} to list`}
            >
              +
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
