'use client';

import React, { useState } from 'react';

interface LunchBannerProps {
  isLunch: boolean;
}

export const LunchBanner: React.FC<LunchBannerProps> = ({ isLunch }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isLunch || isDismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-xl mx-auto px-4 pt-2 pb-1 animate-fadeIn"
    >
      <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-300/60 text-amber-950 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0" aria-hidden="true">☀️</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Lunch Time Active
              </span>
              <span className="text-[10px] text-amber-700/80 font-medium">
                (12 PM – 4 PM)
              </span>
            </div>
            <p className="text-[11px] text-amber-800 leading-tight truncate">
              Pocket Friendly Meals & hearty thalis surfaced first
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-800/70 hover:text-amber-950 p-1 text-xs font-bold flex-shrink-0"
          aria-label="Dismiss lunch time notice"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
