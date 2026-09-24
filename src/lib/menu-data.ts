import rawMenu from '../../menu.json';
import { MenuData, MenuDataSchema } from '@/types/menu';

/**
 * Validated Menu Data singleton.
 * Validates against Zod schema at module evaluation time.
 * If invalid, throws immediately with descriptive error.
 */
function getValidatedMenu(): MenuData {
  const result = MenuDataSchema.safeParse(rawMenu);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join('; ');
    throw new Error(`[CRITICAL] Invalid menu.json schema: ${errorDetails}`);
  }
  return result.data;
}

export const menuData: MenuData = getValidatedMenu();

export function getMenuStats(data: MenuData = menuData) {
  let groupCount = 0;
  let itemCount = 0;
  let vegCount = 0;
  let nonVegCount = 0;
  let variantsCount = 0;

  data.sections.forEach((sec) => {
    sec.groups.forEach((grp) => {
      groupCount++;
      grp.items.forEach((item) => {
        itemCount++;
        if (item.veg) vegCount++;
        else nonVegCount++;
        if (item.variants) variantsCount++;
      });
    });
  });

  return {
    sectionCount: data.sections.length,
    groupCount,
    itemCount,
    vegCount,
    nonVegCount,
    variantsCount,
  };
}
