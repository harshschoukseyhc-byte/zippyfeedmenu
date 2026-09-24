const fs = require('fs');
const path = require('path');
const { z } = require('zod');

const menuPath = path.join(__dirname, '..', 'menu.json');

if (!fs.existsSync(menuPath)) {
  console.error('\x1b[31m[ERROR] menu.json not found at ' + menuPath + '\x1b[0m');
  process.exit(1);
}

let rawData;
try {
  rawData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
} catch (e) {
  console.error('\x1b[31m[ERROR] menu.json is not valid JSON:\x1b[0m', e.message);
  process.exit(1);
}

const RestaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  outlet: z.string().min(1, 'Outlet info is required'),
  tagline: z.string().default(''),
  address: z.string().min(1, 'Address is required'),
  landmark: z.string().default(''),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  instagram: z.string().url('Instagram must be a valid URL'),
  maps: z.string().url('Google Maps must be a valid URL').or(z.string().min(1)),
  googleReviewLink: z.string().url('Google Review must be a valid URL').or(z.string().min(1)),
  hours: z.string().min(1, 'Operating hours are required'),
  currency: z.string().default('INR'),
  notes: z.string().default(''),
  lastUpdated: z.string().min(1, 'Last updated date is required'),
  phoneDisplay: z.string().default(''),
  whatsappLink: z.string().default(''),
});

const CelebrateSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  cta: z.string().min(1),
});

const MenuAddOnSchema = z.object({
  name: z.string().min(1, 'Add-on name is required'),
  price: z.number().int().nonnegative().optional(),
  prices: z.record(z.string(), z.number().int().nonnegative()).optional(),
}).refine(
  (data) => typeof data.price === 'number' || (data.prices && Object.keys(data.prices).length > 0),
  { message: 'Add-on must have either a price or a prices record' }
);

const MenuItemSchema = z.object({
  id: z.string().min(1, 'Item ID is required'),
  name: z.string().min(1, 'Item name is required'),
  veg: z.boolean({ required_error: 'Item veg flag is required' }),
  price: z.number().int().nonnegative().optional(),
  variants: z.record(z.string(), z.number().int().nonnegative()).optional(),
  desc: z.string().optional(),
  unavailable: z.boolean().optional(),
}).refine(
  (data) => typeof data.price === 'number' || (data.variants && Object.keys(data.variants).length > 0),
  { message: 'Item must have either a single price or a variants record' }
);

const MenuGroupSchema = z.object({
  id: z.string().min(1, 'Group ID is required'),
  name: z.string().min(1, 'Group name is required'),
  note: z.string().optional(),
  variantLabels: z.array(z.string()).optional(),
  addOns: z.array(MenuAddOnSchema).optional(),
  items: z.array(MenuItemSchema).min(1, 'Group must have at least one item'),
});

const MenuSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  name: z.string().min(1, 'Section name is required'),
  nameHi: z.string().optional(),
  highlight: z.boolean().optional(),
  badge: z.string().optional(),
  addOns: z.array(MenuAddOnSchema).optional(),
  groups: z.array(MenuGroupSchema).min(1, 'Section must have at least one group'),
});

const MenuDataSchema = z.object({
  restaurant: RestaurantSchema,
  priceNote: z.string().min(1, 'Price note is required'),
  sections: z.array(MenuSectionSchema).min(1, 'Menu must contain sections'),
  celebrate: CelebrateSchema,
});

const parseResult = MenuDataSchema.safeParse(rawData);

if (!parseResult.success) {
  console.error('\x1b[31m[BUILD FAILED] menu.json does not match the schema:\x1b[0m');
  parseResult.error.errors.forEach((err) => {
    console.error(`  - Path: ${err.path.join('.')} | Error: ${err.message}`);
  });
  process.exit(1);
}

const menu = parseResult.data;

console.log('\x1b[32m✔ menu.json parsed and validated successfully!\x1b[0m');
console.log('--- RESTAURANT CONTACT ---');
console.log(`  • Phone:        ${menu.restaurant.phone} (${menu.restaurant.phoneDisplay})`);
console.log(`  • WhatsApp:     ${menu.restaurant.whatsapp} (${menu.restaurant.whatsappLink})`);
console.log(`  • Google Maps:  ${menu.restaurant.maps}`);
console.log(`  • Review Link:  ${menu.restaurant.googleReviewLink}`);

let totalGroups = 0;
let totalItems = 0;
let totalVeg = 0;
let totalNonVeg = 0;
let totalVariants = 0;

console.log('\n--- PER-SECTION BREAKDOWN (computed) ---');
menu.sections.forEach((sec) => {
  let secItems = 0;
  let secVeg = 0;
  let secNonVeg = 0;
  sec.groups.forEach((g) => {
    totalGroups++;
    g.items.forEach((i) => {
      secItems++;
      totalItems++;
      if (i.veg) {
        secVeg++;
        totalVeg++;
      } else {
        secNonVeg++;
        totalNonVeg++;
      }
      if (i.variants) totalVariants++;
    });
  });
  console.log(`  • ${sec.name} — ${sec.groups.length} groups, ${secItems} items (${secVeg} veg / ${secNonVeg} non-veg)`);
});

console.log('\n--- TOTALS ---');
console.log(`  • Sections: ${menu.sections.length}`);
console.log(`  • Groups:   ${totalGroups}`);
console.log(`  • Total items: ${totalItems} (${totalVeg} veg, ${totalNonVeg} non-veg)`);
console.log(`  • Items with variants: ${totalVariants}`);
