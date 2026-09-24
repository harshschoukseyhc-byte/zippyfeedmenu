'use client';

import React, { useRef, useEffect } from 'react';
import { MenuSection } from '@/types/menu';

interface SectionNavProps {
  sections: MenuSection[];
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  lang?: 'en' | 'hi';
}

export const SectionNav: React.FC<SectionNavProps> = ({
  sections,
  activeSectionId,
  onSelectSection,
  lang = 'en',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active chip into view horizontally
  useEffect(() => {
    if (activeBtnRef.current && containerRef.current) {
      const container = containerRef.current;
      const btn = activeBtnRef.current;
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      const containerScrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;

      if (
        btnLeft < containerScrollLeft + 20 ||
        btnLeft + btnWidth > containerScrollLeft + containerWidth - 20
      ) {
        container.scrollTo({
          left: btnLeft - containerWidth / 2 + btnWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [activeSectionId]);

  return (
    <nav
      aria-label="Menu Sections"
      className="bg-zippy-paper/95 backdrop-blur-md border-b border-zippy-paperBorder py-2 px-3 shadow-2xs w-full max-w-full overflow-hidden"
    >
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth w-full max-w-full"
        role="tablist"
      >
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          return (
            <button
              key={section.id}
              ref={isActive ? activeBtnRef : null}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelectSection(section.id)}
              className={`flex-shrink-0 min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 select-none flex items-center gap-1.5 ${
                isActive
                  ? 'bg-zippy-red text-white shadow-sm ring-1 ring-zippy-red'
                  : 'bg-white/80 text-zippy-ink/80 border border-zippy-paperBorder hover:bg-zippy-paperDarker active:bg-zippy-paperBorder'
              }`}
            >
              <span>{lang === 'hi' && section.nameHi ? section.nameHi : section.name}</span>
              {section.badge ? (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-zippy-red/10 text-zippy-red'
                  }`}
                >
                  {section.badge}
                </span>
              ) : section.id === 'korean' ? (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-800 text-white'
                  }`}
                >
                  Rare
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
