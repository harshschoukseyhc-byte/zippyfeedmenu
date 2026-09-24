import { MenuItem, MenuGroup, MenuSection } from '@/types/menu';
import { getItemMinPrice } from '@/lib/price-utils';

export interface MoodConfig {
  id: string;
  label: string;
  subtitle?: string;
  icon?: string;
  sectionIds?: string[];
  groupIds?: string[];
  maxPrice?: number;
  matchItem?: (item: MenuItem, group: MenuGroup, section: MenuSection) => boolean;
}

/**
 * Mood picker definitions.
 * Maps guest intentions ("Kya mann hai?") to menu sections, groups, and rules.
 * Edit this config file to adjust mappings without changing component code.
 */
export const MOODS: MoodConfig[] = [
  {
    id: 'bhook-zyada',
    label: 'Bhook zyada hai',
    subtitle: 'Main course, biryani, 12" pizza & hearty meals',
    icon: '🍛',
    groupIds: [
      'main-veg',     // Indian Main Course (Veg)
      'main-nonveg',  // Indian Main Course (Non-Veg)
      'dal',          // Dal Special
      'meals',        // Pocket Friendly Meals
      'rice',         // Indian Rice & Biryani
    ],
    // Pizza 12 inch
    matchItem: (_item, _group, section) => section.id === 'pizza',
  },
  {
    id: 'halka-phulka',
    label: 'Halka-phulka',
    subtitle: 'Soups, south-indian snacks & light thukpa',
    icon: '🥣',
    groupIds: [
      'ch-soup',      // Chinese Soup
      'idli-vada',    // South Indian Idli & Vada
      'uttapam',      // South Indian Uttapam
      'thukpa',       // Asian Special Thukpa
      'sandwich',     // Grilled Sandwich & Chips
    ],
  },
  {
    id: 'sweet-kuch',
    label: 'Sweet kuch',
    subtitle: 'Waffles, brownies, cheesecakes & rich shakes',
    icon: '🍰',
    sectionIds: ['desserts'], // Entire Desserts section
    groupIds: ['shakes'],     // Beverages -> Shakes
  },
  {
    id: 'thanda-kuch',
    label: 'Thanda kuch',
    subtitle: 'Chilled mojitos, thick shakes & cold coffee',
    icon: '🥤',
    groupIds: [
      'mojito',       // Mojitos
      'shakes',       // Thick Shakes
      'cold-coffee',  // Cold Coffee
    ],
  },
  {
    id: 'group-ke-saath',
    label: 'Group ke saath',
    subtitle: 'Shareable combos, 12" pizza, momos & starter platters',
    icon: '🍕',
    sectionIds: [
      'combos',       // Combos & Pocket Friendly Meals
      'pizza',        // Neapolitan Pizza (10" & 12")
      'momo',         // Momo platters
    ],
    groupIds: [
      'tandoori',     // Tandoori Starters
      'ch-starter',   // Chinese Starters
      'k-appetizers', // Korean Appetizers
    ],
  },
  {
    id: 'kam-budget',
    label: 'Kam budget',
    subtitle: 'All delicious dishes at or under ₹250',
    icon: '💰',
    maxPrice: 250,    // Computed rule: item price or lowest variant <= ₹250
  },
];

/**
 * Filter helper to test if an item matches a specific mood.
 */
export function itemMatchesMood(
  item: MenuItem,
  group: MenuGroup,
  section: MenuSection,
  mood: MoodConfig
): boolean {
  // 1. Max price rule
  if (typeof mood.maxPrice === 'number') {
    if (getItemMinPrice(item) <= mood.maxPrice) return true;
  }

  // 2. Section ID rule
  if (mood.sectionIds && mood.sectionIds.includes(section.id)) {
    return true;
  }

  // 3. Group ID rule
  if (mood.groupIds && mood.groupIds.includes(group.id)) {
    return true;
  }

  // 4. Custom matcher rule
  if (mood.matchItem && mood.matchItem(item, group, section)) {
    return true;
  }

  return false;
}
