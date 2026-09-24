import { MenuItem } from '@/types/menu';

/**
 * Returns the effective minimum price of a menu item.
 * If item has fixed price, returns price.
 * If item has variants (e.g. Steam ₹249 / Fried ₹279, 10" ₹399 / 12" ₹529),
 * returns the minimum variant price.
 */
export function getItemMinPrice(item: MenuItem): number {
  if (typeof item.price === 'number') {
    return item.price;
  }
  if (item.variants && Object.keys(item.variants).length > 0) {
    return Math.min(...Object.values(item.variants));
  }
  return Infinity;
}

export const PRICE_TIERS = [
  { id: 'under-200', label: 'Under ₹200', maxPrice: 200 },
  { id: 'under-300', label: 'Under ₹300', maxPrice: 300 },
  { id: 'under-500', label: 'Under ₹500', maxPrice: 500 },
] as const;
