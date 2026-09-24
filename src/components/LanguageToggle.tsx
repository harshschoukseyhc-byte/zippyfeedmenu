'use client';

import React from 'react';

interface LanguageToggleProps {
  lang: 'en' | 'hi';
  onToggle: (lang: 'en' | 'hi') => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ lang, onToggle }) => {
  return (
    <div
      className="inline-flex items-center rounded-full bg-black/25 p-0.5 border border-white/20 text-[11px] font-bold"
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => onToggle('en')}
        aria-pressed={lang === 'en'}
        className={`px-2 py-0.5 rounded-full transition-all ${
          lang === 'en'
            ? 'bg-white text-zippy-maroon shadow-xs'
            : 'text-white/80 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onToggle('hi')}
        aria-pressed={lang === 'hi'}
        className={`px-2 py-0.5 rounded-full transition-all ${
          lang === 'hi'
            ? 'bg-white text-zippy-maroon shadow-xs font-semibold'
            : 'text-white/80 hover:text-white'
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};
