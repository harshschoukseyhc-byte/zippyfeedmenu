'use client';

import React from 'react';
import { MenuSection, MenuItem } from '@/types/menu';
import { ItemRow } from './ItemRow';
import { AddOnPill } from './AddOnPill';

interface MenuSectionViewProps {
  section: MenuSection;
  onSelectItem?: (item: MenuItem) => void;
  onSelectVariant?: (item: MenuItem, variantLabel: string, price: number) => void;
  trayQuantities?: Record<string, number>;
  isLunch?: boolean;
  lang?: 'en' | 'hi';
}

export const MenuSectionView: React.FC<MenuSectionViewProps> = ({
  section,
  onSelectItem,
  onSelectVariant,
  trayQuantities,
  isLunch = false,
  lang = 'en',
}) => {
  const isCombosHighlight = section.highlight && section.id === 'combos';
  const isKoreanSpotlight = section.highlight && section.id === 'korean';

  return (
    <section
      id={section.id}
      data-section-id={section.id}
      className={`scroll-mt-36 pt-6 pb-5 border-b border-zippy-paperBorder/80 w-full max-w-full overflow-hidden transition-all ${
        isCombosHighlight
          ? 'bg-gradient-to-b from-amber-50/60 via-white/40 to-transparent rounded-3xl mx-auto my-2 border border-zippy-gold/30 shadow-xs'
          : isKoreanSpotlight
          ? 'bg-gradient-to-b from-red-50/40 via-stone-50/40 to-transparent rounded-3xl mx-auto my-3 border border-zippy-red/20 shadow-xs'
          : ''
      }`}
    >
      {/* Section Header */}
      <div className="px-4 mb-3">
        {/* Combos Highlight Top Tag */}
        {isCombosHighlight && (
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold text-zippy-gold">
            <span>✦</span>
            <span className="uppercase tracking-widest text-[11px] font-bold text-zippy-maroon">
              Strongest Price Story
            </span>
          </div>
        )}

        {/* Korean Spotlight Top Tag */}
        {isKoreanSpotlight && (
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-zippy-red text-white shadow-2xs">
              <span>✦</span> Bhopal Mein Rare · Only At Zippyfeed
            </span>
            <span className="font-serif text-xs text-zippy-muted/80 tracking-widest">
              한국 요리
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-baseline gap-2 min-w-0">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-zippy-maroon tracking-tight">
              {lang === 'hi' && section.nameHi ? section.nameHi : section.name}
            </h2>
            {section.nameHi && (
              <span className="text-xs text-zippy-muted font-sans font-normal">
                {lang === 'hi' ? section.name : section.nameHi}
              </span>
            )}
          </div>
          {section.badge ? (
            <span
              className={`inline-flex items-center text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-xs flex-shrink-0 ${
                isCombosHighlight
                  ? 'bg-zippy-red text-white ring-2 ring-zippy-gold/40'
                  : 'bg-zippy-red/10 text-zippy-red border border-zippy-red/20'
              }`}
            >
              {section.badge}
            </span>
          ) : isKoreanSpotlight ? (
            <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stone-900 text-white shadow-xs flex-shrink-0">
              Exclusive Cuisine
            </span>
          ) : null}
        </div>

        {/* Korean Cuisine Micro-Narrative */}
        {isKoreanSpotlight && (
          <p className="text-xs text-zippy-muted mt-1.5 leading-relaxed font-sans">
            Authentic Korean street food, spicy ramen bowls, kimchi & gochujang dishes — the one cuisine almost no other Bhopal restaurant serves.
          </p>
        )}

        {/* Section-level AddOns */}
        {section.addOns && section.addOns.length > 0 && (
          <AddOnPill addOns={section.addOns} className="mt-2" />
        )}

        {/* Thin Gold Hairline */}
        <div
          className={`h-[1.5px] mt-2.5 rounded-full ${
            isCombosHighlight || isKoreanSpotlight ? 'w-20 bg-zippy-gold' : 'w-12 bg-zippy-gold/60'
          }`}
        />
      </div>

      {/* Groups Container */}
      <div className="space-y-5 w-full">
        {section.groups.map((group) => (
          <div key={group.id} className="px-4 w-full">
            {/* Group Header */}
            <div className="mb-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zippy-ink/90 flex items-center gap-1.5">
                    {isCombosHighlight && <span className="text-zippy-red text-xs">●</span>}
                    {isKoreanSpotlight && <span className="text-zippy-gold text-xs">◆</span>}
                    {group.name}
                  </h3>
                  {isLunch && (group.id === 'meals' || (section.id === 'indian' && ['main-veg', 'main-nonveg', 'dal', 'rice'].includes(group.id))) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80 tracking-wide uppercase shadow-2xs">
                      <span>☀️</span>
                      <span>Lunch time</span>
                    </span>
                  )}
                </div>
                {group.note && (
                  <span className="text-[11px] text-zippy-muted italic font-normal">
                    {group.note}
                  </span>
                )}
              </div>

              {/* Group-level AddOns */}
              {group.addOns && group.addOns.length > 0 && (
                <AddOnPill addOns={group.addOns} className="mt-1" />
              )}
            </div>

            {/* Items List in Group */}
            <div
              className={`divide-y divide-zippy-paperBorder/60 rounded-2xl px-2 py-1 border shadow-xs w-full overflow-hidden ${
                isCombosHighlight
                  ? 'bg-white/90 border-zippy-gold/40'
                  : isKoreanSpotlight
                  ? 'bg-white/90 border-stone-300/80 shadow-2xs'
                  : 'bg-white/70 border-zippy-paperBorder'
              }`}
            >
              {group.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onSelect={onSelectItem}
                  onSelectVariant={onSelectVariant}
                  quantityInTray={trayQuantities?.[item.id] || 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
