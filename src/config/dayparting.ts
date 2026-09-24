import { MenuSection, MenuGroup } from '@/types/menu';

export interface DaypartingConfig {
  /** Master switch to turn dayparting on or off */
  enabled: boolean;
  /** Lunch window start hour in Asia/Kolkata (inclusive, 12 = 12:00 PM) */
  lunchStartHour: number;
  /** Lunch window end hour in Asia/Kolkata (exclusive, 16 = 4:00 PM) */
  lunchEndHour: number;
  /** Timezone for restaurant operations */
  timezone: string;
  /** Badge text to show on lunch-appropriate groups */
  lunchBadgeText: string;
  /** Group IDs prioritized during lunch time */
  lunchGroupIds: string[];
}

/**
 * Single source of truth for Dayparting configuration.
 * Easy to adjust hours, change prioritized groups, or toggle off entirely.
 */
export const DAYPARTING_CONFIG: DaypartingConfig = {
  enabled: true,
  lunchStartHour: 12,
  lunchEndHour: 16,
  timezone: 'Asia/Kolkata',
  lunchBadgeText: 'Lunch time',
  lunchGroupIds: [
    'meals',        // Pocket Friendly Meals (combos section)
    'dal',          // Dal Special (indian section)
    'main-veg',     // Main Course — Veg (indian section)
    'main-nonveg',  // Main Course — Non Veg (indian section)
    'rice',         // Indian Rice (indian section)
  ],
};

/**
 * Checks if current time is within the lunch window (12 PM - 4 PM Asia/Kolkata).
 * Supports explicit date or hour override for automated testing and verification.
 */
export function isLunchTime(date: Date = new Date(), overrideHour?: number): boolean {
  if (!DAYPARTING_CONFIG.enabled) return false;

  let hour: number;
  if (typeof overrideHour === 'number') {
    hour = overrideHour;
  } else {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: DAYPARTING_CONFIG.timezone,
        hour: 'numeric',
        hour12: false,
      });
      hour = parseInt(formatter.format(date), 10);
    } catch {
      hour = date.getHours();
    }
  }

  return hour >= DAYPARTING_CONFIG.lunchStartHour && hour < DAYPARTING_CONFIG.lunchEndHour;
}

/**
 * Reorders groups within sections during lunch time:
 * Surfaces 'meals' (Pocket Friendly Meals) and lunch-appropriate groups higher,
 * tagging them with the 'Lunch time' badge.
 */
export function applyDayparting(
  sections: MenuSection[],
  isLunch: boolean
): MenuSection[] {
  if (!DAYPARTING_CONFIG.enabled || !isLunch) {
    return sections;
  }

  return sections.map((section) => {
    // 1. In 'combos' section: Surface 'meals' (Pocket Friendly Meals) to the top
    if (section.id === 'combos') {
      const mealsGroup = section.groups.find((g) => g.id === 'meals');
      const otherGroups = section.groups.filter((g) => g.id !== 'meals');

      if (mealsGroup) {
        return {
          ...section,
          groups: [mealsGroup, ...otherGroups],
        };
      }
    }

    // 2. In 'indian' section: Surface main course, dal, and rice higher
    if (section.id === 'indian') {
      const lunchGroups: MenuGroup[] = [];
      const nonLunchGroups: MenuGroup[] = [];

      section.groups.forEach((group) => {
        if (DAYPARTING_CONFIG.lunchGroupIds.includes(group.id)) {
          lunchGroups.push(group);
        } else {
          nonLunchGroups.push(group);
        }
      });

      if (lunchGroups.length > 0) {
        return {
          ...section,
          groups: [...lunchGroups, ...nonLunchGroups],
        };
      }
    }

    return section;
  });
}
