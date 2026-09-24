'use client';

import React, { useEffect, useState } from 'react';
import { RestaurantInfo } from '@/types/menu';

interface TopBarProps {
  restaurant: RestaurantInfo;
  rightSlot?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ restaurant, rightSlot }) => {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    function computeStatus() {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: 'numeric',
          minute: 'numeric',
        };
        const formatter = new Intl.DateTimeFormat('en-GB', options);
        const parts = formatter.formatToParts(now);
        const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
        const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
        const currentMins = hour * 60 + minute;
        // 11:00 AM (660 mins) to 11:00 PM (1380 mins)
        setIsOpen(currentMins >= 660 && currentMins < 1380);
      } catch {
        const localHour = new Date().getHours();
        setIsOpen(localHour >= 11 && localHour < 23);
      }
    }

    computeStatus();
    const interval = setInterval(computeStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-zippy-maroon text-white shadow-md border-b border-zippy-gold/30 w-full">
      <div className="max-w-xl mx-auto px-3.5 py-2.5 flex items-center justify-between gap-2.5">
        {/* Restaurant Identity */}
        <div className="flex-1 min-w-0 pr-1">
          <h1 className="font-serif font-bold text-base sm:text-lg text-white tracking-tight truncate leading-tight">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-1.5 text-[11px] text-white/80 mt-0.5 truncate">
            <span className="truncate">📍 {restaurant.landmark}</span>
            <span className="text-zippy-gold/60">•</span>
            {isOpen === null ? (
              <span className="text-white/60">11 AM – 11 PM</span>
            ) : isOpen ? (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-300 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-amber-200 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                Opens 11 AM
              </span>
            )}
          </div>
        </div>

        {/* Right Slot: Veg Switch */}
        {rightSlot && <div className="flex-shrink-0 flex items-center">{rightSlot}</div>}
      </div>
    </header>
  );
};
