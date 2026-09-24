import React from 'react';
import { MenuAddOn } from '@/types/menu';

interface AddOnPillProps {
  addOns: MenuAddOn[];
  className?: string;
}

export const AddOnPill: React.FC<AddOnPillProps> = ({ addOns, className = '' }) => {
  if (!addOns || addOns.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 my-2 ${className}`}>
      {addOns.map((addOn, index) => {
        let label = '';
        if (addOn.prices) {
          const variantText = Object.entries(addOn.prices)
            .map(([size, price]) => `${size} ₹${price}`)
            .join(' · ');
          label = `Add ${addOn.name} (${variantText})`;
        } else if (typeof addOn.price === 'number') {
          label = `Add ${addOn.name} +₹${addOn.price}`;
        }

        return (
          <span
            key={index}
            className="inline-flex items-center text-[11px] font-medium tracking-tight px-2.5 py-1 rounded-full bg-zippy-paperDarker text-zippy-ink/80 border border-zippy-gold/40 shadow-xs"
          >
            <span className="text-zippy-gold mr-1 text-xs">✦</span>
            {label}
          </span>
        );
      })}
    </div>
  );
};
