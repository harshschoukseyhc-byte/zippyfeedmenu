'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MenuItem, MenuData } from '@/types/menu';
import { PickedItem } from '@/types/picks';
import { MOODS, itemMatchesMood } from '@/config/moods';
import { TopBar } from './TopBar';
import { VegToggle } from './VegToggle';
import { VegConfirmationStrip } from './VegConfirmationStrip';
import { MoodPicker } from './MoodPicker';
import { SectionNav } from './SectionNav';
import { SearchBar } from './SearchBar';
import { SearchResults, SearchResultItem } from './SearchResults';
import { MenuSectionView } from './MenuSectionView';
import { PriceFilter } from './PriceFilter';
import { PicksTray } from './PicksTray';
import { VariantModal } from './VariantModal';
import { LunchBanner } from './LunchBanner';
import { LanguageToggle } from './LanguageToggle';
import { AboutBlock } from './AboutBlock';
import { CelebrateCard } from './CelebrateCard';
import { Footer } from './Footer';
import { getItemMinPrice } from '@/lib/price-utils';
import { isLunchTime, applyDayparting } from '@/config/dayparting';
import {
  trackDishTap,
  trackSearchQuery,
  trackVegToggle,
  trackMoodChoice,
  trackSectionView,
} from '@/lib/analytics';

interface CoreMenuProps {
  menu: MenuData;
}

const VEG_STORAGE_KEY = 'zippy_veg_only';
const MOOD_DISMISSED_KEY = 'zippy_mood_dismissed';
const PICKS_STORAGE_KEY = 'zippy_picks';
const LANG_STORAGE_KEY = 'zippy_lang';

export const CoreMenu: React.FC<CoreMenuProps> = ({ menu }) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const [activeMoodId, setActiveMoodId] = useState<string | null>(null);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<number | null>(null);
  const [isMoodDismissed, setIsMoodDismissed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState(menu.sections[0]?.id || '');
  const [pickedItems, setPickedItems] = useState<PickedItem[]>([]);
  const [variantModalItem, setVariantModalItem] = useState<MenuItem | null>(null);
  const [isLunchActive, setIsLunchActive] = useState<boolean>(() => isLunchTime());

  // 1. Read localStorage states and URL overrides on initial client mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'hi' || savedLang === 'en') {
        setLang(savedLang);
      }
      const savedVeg = localStorage.getItem(VEG_STORAGE_KEY) === 'true';
      if (savedVeg) {
        setIsVegOnly(true);
      }
      if (localStorage.getItem(MOOD_DISMISSED_KEY) === 'true') {
        setIsMoodDismissed(true);
      }
      const savedPicks = localStorage.getItem(PICKS_STORAGE_KEY);
      if (savedPicks) {
        const parsed: PickedItem[] = JSON.parse(savedPicks);
        setPickedItems(savedVeg ? parsed.filter((p) => p.veg) : parsed);
      }
      const urlParams = new URLSearchParams(window.location.search);
      const lunchParam = urlParams.get('lunch');
      if (lunchParam === 'true') {
        setIsLunchActive(true);
      } else if (lunchParam === 'false') {
        setIsLunchActive(false);
      } else {
        setIsLunchActive(isLunchTime());
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const handleToggleLang = useCallback((newLang: 'en' | 'hi') => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // Ignore write errors
    }
  }, []);

  // Sync pickedItems to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PICKS_STORAGE_KEY, JSON.stringify(pickedItems));
    } catch {
      // Ignore write errors
    }
  }, [pickedItems]);

  // 2. Persist veg toggle changes & automatically prune non-veg from tray
  const handleToggleVegOnly = useCallback((val: boolean) => {
    setIsVegOnly(val);
    trackVegToggle(val);
    if (val) {
      setPickedItems((prev) => prev.filter((p) => p.veg === true));
    }
    try {
      localStorage.setItem(VEG_STORAGE_KEY, String(val));
    } catch {
      // Ignore write errors
    }
  }, []);

  // 2b. Tray modification handlers
  const handlePickDish = useCallback((item: MenuItem) => {
    trackDishTap(item.id, item.name, undefined, item.price, item.veg);
    if (item.variants && Object.keys(item.variants).length > 0) {
      setVariantModalItem(item);
      return;
    }
    const itemPrice = item.price;
    if (typeof itemPrice === 'number') {
      setPickedItems((prev) => {
        const existingIndex = prev.findIndex((p) => p.itemId === item.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += 1;
          return updated;
        }
        return [
          ...prev,
          {
            id: `${item.id}-base`,
            itemId: item.id,
            name: item.name,
            price: itemPrice,
            veg: item.veg,
            quantity: 1,
          },
        ];
      });
    }
  }, []);

  const handlePickVariant = useCallback((item: MenuItem, variantLabel: string, price: number) => {
    trackDishTap(item.id, `${item.name} (${variantLabel})`, undefined, price, item.veg);
    const key = `${item.id}-${variantLabel}`;
    setPickedItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: key,
          itemId: item.id,
          name: item.name,
          variantLabel,
          price,
          veg: item.veg,
          quantity: 1,
        },
      ];
    });
  }, []);

  const handleIncrement = useCallback((id: string) => {
    setPickedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  }, []);

  const handleDecrement = useCallback((id: string) => {
    setPickedItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const handleClearPicks = useCallback(() => {
    setPickedItems([]);
  }, []);

  // Map of dish quantities in tray for fast UI lookup
  const trayQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    pickedItems.forEach((p) => {
      map[p.itemId] = (map[p.itemId] || 0) + p.quantity;
    });
    return map;
  }, [pickedItems]);

  // 3. Handle mood selection and dismissal
  const handleSelectMood = useCallback((moodId: string) => {
    setActiveMoodId(moodId);
    const m = MOODS.find((item) => item.id === moodId);
    if (m) {
      trackMoodChoice(m.id, m.label);
    }
    try {
      localStorage.setItem(MOOD_DISMISSED_KEY, 'true');
    } catch {
      // Ignore write errors
    }
  }, []);

  const handleClearMood = useCallback(() => {
    setActiveMoodId(null);
  }, []);

  const handleDismissMood = useCallback(() => {
    setIsMoodDismissed(true);
    try {
      localStorage.setItem(MOOD_DISMISSED_KEY, 'true');
    } catch {
      // Ignore write errors
    }
  }, []);

  // Find active mood config
  const activeMood = useMemo(() => MOODS.find((m) => m.id === activeMoodId), [activeMoodId]);

  // Compute dynamic item counts for price tiers based on current veg toggle
  const priceCounts = useMemo(() => {
    let c200 = 0;
    let c300 = 0;
    let c500 = 0;
    menu.sections.forEach((sec) => {
      sec.groups.forEach((grp) => {
        grp.items.forEach((item) => {
          if (isVegOnly && !item.veg) return;
          const p = getItemMinPrice(item);
          if (p <= 200) c200++;
          if (p <= 300) c300++;
          if (p <= 500) c500++;
        });
      });
    });
    return { 200: c200, 300: c300, 500: c500 };
  }, [menu.sections, isVegOnly]);

  // 4. Compute filtered sections (strictly respects isVegOnly, activeMood, selectedMaxPrice, and isLunchActive)
  const filteredSections = useMemo(() => {
    const rawFiltered = menu.sections
      .map((sec) => {
        const filteredGroups = sec.groups
          .map((grp) => {
            // Veg-only filter runs FIRST — non-veg items are strictly eliminated
            let items = isVegOnly
              ? grp.items.filter((item) => item.veg === true)
              : grp.items;

            // Mood filter applied on remaining valid items
            if (activeMood) {
              items = items.filter((item) => itemMatchesMood(item, grp, sec, activeMood));
            }

            // Price filter applied on remaining valid items
            if (selectedMaxPrice !== null) {
              items = items.filter((item) => getItemMinPrice(item) <= selectedMaxPrice);
            }

            return { ...grp, items };
          })
          .filter((grp) => grp.items.length > 0);

        return { ...sec, groups: filteredGroups };
      })
      .filter((sec) => sec.groups.length > 0);

    return applyDayparting(rawFiltered, isLunchActive);
  }, [menu.sections, isVegOnly, activeMood, selectedMaxPrice, isLunchActive]);

  // 5. Flatten filtered items for search index (zero non-veg leakage)
  const searchableItems: SearchResultItem[] = useMemo(() => {
    const list: SearchResultItem[] = [];
    filteredSections.forEach((sec) => {
      sec.groups.forEach((grp) => {
        grp.items.forEach((item) => {
          if (!isVegOnly || item.veg === true) {
            list.push({
              ...item,
              sectionName: sec.name,
              sectionId: sec.id,
              groupName: grp.name,
            });
          }
        });
      });
    });
    return list;
  }, [filteredSections, isVegOnly]);

  // Total visible items count
  const totalVisibleCount = searchableItems.length;

  // Search filter
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return searchableItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [searchQuery, searchableItems]);

  // Scrollspy observer
  useEffect(() => {
    if (searchQuery.trim()) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
        const id = visibleEntries[0].target.getAttribute('data-section-id');
        if (id) {
          setActiveSectionId(id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-120px 0px -50% 0px',
      threshold: [0, 0.1, 0.5],
    });

    filteredSections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredSections, searchQuery]);

  // Ensure activeSectionId remains valid when sections change
  useEffect(() => {
    if (filteredSections.length > 0) {
      const exists = filteredSections.some((s) => s.id === activeSectionId);
      if (!exists) {
        setActiveSectionId(filteredSections[0].id);
      }
    }
  }, [filteredSections, activeSectionId]);

  // Handle section click
  const handleSelectSection = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
    const sec = menu.sections.find((s) => s.id === sectionId);
    if (sec) {
      trackSectionView(sec.id, sec.name);
    }
    if (searchQuery) setSearchQuery('');

    const el = document.getElementById(sectionId);
    if (el) {
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 110;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 10;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, [searchQuery, menu.sections]);

  // Track search queries with debounce (>= 2 chars)
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;
    const timer = setTimeout(() => {
      trackSearchQuery(q, searchResults.length, isVegOnly);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, searchResults.length, isVegOnly]);

  return (
    <div className={`min-h-screen bg-zippy-paper text-zippy-ink w-full max-w-full ${pickedItems.length > 0 ? 'pb-32' : 'pb-20'}`}>
      {/* 1. Permanent Unified Sticky Header */}
      <header className="sticky top-0 z-40 w-full shadow-sm bg-zippy-paper">
        <TopBar
          restaurant={menu.restaurant}
          rightSlot={
            <div className="flex items-center gap-1.5 sm:gap-2">
              <LanguageToggle lang={lang} onToggle={handleToggleLang} />
              <VegToggle
                isVegOnly={isVegOnly}
                onToggle={handleToggleVegOnly}
              />
            </div>
          }
        />

        {/* Calm Confirmation Strip (visible only when isVegOnly is ON) */}
        <VegConfirmationStrip
          isVegOnly={isVegOnly}
          itemCount={totalVisibleCount}
          onDisable={() => handleToggleVegOnly(false)}
        />

        {/* Section Navigation Chips (hidden only when user is searching) */}
        {!searchQuery.trim() && (
          <div className="w-full max-w-xl mx-auto">
            <SectionNav
              sections={filteredSections}
              activeSectionId={activeSectionId}
              onSelectSection={handleSelectSection}
              lang={lang}
            />
          </div>
        )}
      </header>

      {/* Lunch Time Callout Banner */}
      <LunchBanner isLunch={isLunchActive} />

      {/* 2. Mood Picker (Dismissible, never blocking, 1-tap shortlist) */}
      {!searchQuery.trim() && (
        <div className="w-full max-w-xl mx-auto">
          <MoodPicker
            activeMoodId={activeMoodId}
            onSelectMood={handleSelectMood}
            onClearMood={handleClearMood}
            isDismissed={isMoodDismissed}
            onDismiss={handleDismissMood}
            activeMoodItemCount={totalVisibleCount}
          />
        </div>
      )}

      {/* 3. Search Input */}
      <div className="w-full max-w-xl mx-auto">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={searchResults.length}
          totalCount={totalVisibleCount}
        />
      </div>

      {/* 4. Price Filter Quick Chips */}
      <div className="w-full max-w-xl mx-auto">
        <PriceFilter
          selectedMaxPrice={selectedMaxPrice}
          onSelectPrice={setSelectedMaxPrice}
          counts={priceCounts}
          totalVisible={totalVisibleCount}
          isVegOnly={isVegOnly}
        />
      </div>

      {/* 5. Main Content: Search Results OR Full Menu */}
      {searchQuery.trim() ? (
        <main className="w-full max-w-xl mx-auto pb-12">
          <SearchResults
            query={searchQuery}
            results={searchResults}
            onSelectDish={handlePickDish}
            onSelectVariant={handlePickVariant}
            trayQuantities={trayQuantities}
            onSelectSuggestion={(term) => setSearchQuery(term)}
            onClear={() => setSearchQuery('')}
          />
        </main>
      ) : (
        <main className="w-full max-w-xl mx-auto space-y-4">
          {filteredSections.map((section) => (
            <MenuSectionView
              key={section.id}
              section={section}
              onSelectItem={handlePickDish}
              onSelectVariant={handlePickVariant}
              trayQuantities={trayQuantities}
              isLunch={isLunchActive}
              lang={lang}
            />
          ))}
        </main>
      )}

      {/* Celebrate Events Card */}
      {!searchQuery.trim() && (
        <CelebrateCard
          celebrate={menu.celebrate}
          restaurant={menu.restaurant}
          lang={lang}
        />
      )}

      {/* About Zippyfeed Block */}
      {!searchQuery.trim() && (
        <AboutBlock
          restaurant={menu.restaurant}
          lang={lang}
        />
      )}

      {/* Comprehensive Trust & Contact Footer */}
      <Footer
        restaurant={menu.restaurant}
        priceNote={menu.priceNote}
        lang={lang}
      />

      {/* Picks Tray (Floating Sticky Bar & Expandable Drawer) */}
      <PicksTray
        items={pickedItems}
        restaurantName={menu.restaurant.name}
        outlet={menu.restaurant.outlet}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onClear={handleClearPicks}
      />

      {/* Variant Selection Modal */}
      <VariantModal
        item={variantModalItem}
        onClose={() => setVariantModalItem(null)}
        onSelectVariant={handlePickVariant}
      />
    </div>
  );
};
