import { z } from 'zod';

export const RestaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  outlet: z.string().min(1, 'Outlet info is required'),
  tagline: z.string().default(''),
  address: z.string().min(1, 'Address is required'),
  landmark: z.string().default(''),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  instagram: z.string().url('Instagram must be a valid URL'),
  maps: z.string().default(''),
  googleReviewLink: z.string().default(''),
  hours: z.string().min(1, 'Operating hours are required'),
  currency: z.string().default('INR'),
  notes: z.string().default(''),
  lastUpdated: z.string().min(1, 'Last updated date is required'),
  phoneDisplay: z.string().default(''),
  whatsappLink: z.string().default(''),
});

export const CelebrateSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  cta: z.string().min(1),
});

export const MenuAddOnSchema = z.object({
  name: z.string().min(1, 'Add-on name is required'),
  price: z.number().int().nonnegative().optional(),
  prices: z.record(z.string(), z.number().int().nonnegative()).optional(),
}).refine(
  (data) => typeof data.price === 'number' || (data.prices && Object.keys(data.prices).length > 0),
  { message: 'Add-on must have either a price or a prices record' }
);

export const MenuItemSchema = z.object({
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

export const MenuGroupSchema = z.object({
  id: z.string().min(1, 'Group ID is required'),
  name: z.string().min(1, 'Group name is required'),
  note: z.string().optional(),
  variantLabels: z.array(z.string()).optional(),
  addOns: z.array(MenuAddOnSchema).optional(),
  items: z.array(MenuItemSchema).min(1, 'Group must have at least one item'),
});

export const MenuSectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  name: z.string().min(1, 'Section name is required'),
  nameHi: z.string().optional(),
  highlight: z.boolean().optional(),
  badge: z.string().optional(),
  addOns: z.array(MenuAddOnSchema).optional(),
  groups: z.array(MenuGroupSchema).min(1, 'Section must have at least one group'),
});

export const MenuDataSchema = z.object({
  restaurant: RestaurantSchema,
  priceNote: z.string().min(1, 'Price note is required'),
  sections: z.array(MenuSectionSchema).min(1, 'Menu must contain sections'),
  celebrate: CelebrateSchema,
});

export type RestaurantInfo = z.infer<typeof RestaurantSchema>;
export type CelebrateInfo = z.infer<typeof CelebrateSchema>;
export type MenuAddOn = z.infer<typeof MenuAddOnSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuGroup = z.infer<typeof MenuGroupSchema>;
export type MenuSection = z.infer<typeof MenuSectionSchema>;
export type MenuData = z.infer<typeof MenuDataSchema>;
