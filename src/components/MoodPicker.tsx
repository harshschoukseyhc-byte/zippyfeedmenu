'use client';

import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { MOODS, MoodConfig } from '@/config/moods';

interface MoodPickerProps {
  activeMoodId: string | null;
  onSelectMood: (moodId: string) => void;
  onClearMood: () => void;
  isDismissed: boolean;
  onDismiss: () => void;
  activeMoodItemCount?: number;
}

export const MoodPicker: React.FC<MoodPickerProps> = ({
  activeMoodId,
  onSelectMood,
  onClearMood,
  isDismissed,
  onDismiss,
  activeMoodItemCount,
}) => {
  const activeMood = MOODS.find((m) => m.id === activeMoodId);

  // If a mood is active, show the active filter strip with 1-tap Clear
  if (activeMood) {
    return (
      <div className="px-4 py-2.5 bg-zippy-paper">
        <div className="bg-zippy-red/10 border border-zippy-red/30 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base flex-shrink-0">{activeMood.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-zippy-maroon">
                  {activeMood.label}
                </span>
                {typeof activeMoodItemCount === 'number' && (
                  <span className="text-[11px] text-zippy-muted font-medium">
                    ({activeMoodItemCount} dishes)
                  </span>
                )}
              </div>
              {activeMood.subtitle && (
                <p className="text-[10px] text-zippy-muted truncate">
                  {activeMood.subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClearMood}
            className="flex-shrink-0 text-xs font-semibold text-zippy-red hover:text-zippy-maroon underline px-2 py-1 min-h-[44px] flex items-center"
            aria-label="Clear mood filter and show full menu"
          >
            Clear filter
          </button>
        </div>
      </div>
    );
  }

  // If dismissed and no mood active, do not render inline card
  if (isDismissed) {
    return null;
  }

  return (
    <section
      aria-label="Mood Selector"
      className="px-4 py-3 bg-zippy-paper"
    >
      <div className="bg-white/80 backdrop-blur-sm border border-zippy-paperBorder rounded-2xl p-3.5 shadow-2xs">
        {/* Header with Title and Dismiss (X) */}
        <div className="flex items-center justify-between pb-2 border-b border-zippy-paperBorder/60 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles size={15} className="text-zippy-gold" aria-hidden="true" />
            <h3 className="font-serif font-bold text-sm text-zippy-maroon">
              Kya mann hai?
            </h3>
            <span className="text-[11px] text-zippy-muted font-normal">
              · Quick shortlist
            </span>
          </div>

          <button
            onClick={onDismiss}
            className="text-stone-400 hover:text-zippy-ink p-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors"
            aria-label="Dismiss mood suggestions"
          >
            <X size={15} />
          </button>
        </div>

        {/* Mood Chips Grid */}
        <div className="flex flex-wrap gap-1.5">
          {MOODS.map((mood) => {
            const isSelected = mood.id === activeMoodId;
            return (
              <button
                key={mood.id}
                onClick={() => onSelectMood(mood.id)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zippy-red text-white shadow-sm ring-1 ring-zippy-red'
                    : 'bg-zippy-paper text-zippy-ink hover:bg-zippy-paperDarker border border-zippy-paperBorder active:scale-[0.98]'
                }`}
                aria-label={`Select mood ${mood.label}`}
              >
                <span className="text-sm" aria-hidden="true">
                  {mood.icon}
                </span>
                <span>{mood.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
