import { MenuItem } from './menu';

export interface PickedItem {
  id: string; // Unique composite key: `${item.id}-${variantLabel || 'base'}`
  itemId: string;
  name: string;
  variantLabel?: string;
  price: number;
  veg: boolean;
  quantity: number;
}

export interface PicksSummary {
  totalItems: number;
  totalPrice: number;
}

export function formatWhatsAppOrderText(
  restaurantName: string,
  outlet: string,
  items: PickedItem[],
  totalPrice: number
): string {
  const lines: string[] = [];
  lines.push(`*${restaurantName} — Hamari Order List*`);
  lines.push(`📍 ${outlet}`);
  lines.push('──────────────────');

  items.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    const variantStr = item.variantLabel ? ` (${item.variantLabel})` : '';
    lines.push(`• ${item.quantity}x ${item.name}${variantStr} — ₹${itemTotal}`);
  });

  lines.push('──────────────────');
  lines.push(`*Estimated Total: ₹${totalPrice}*`);
  lines.push('');
  lines.push('Order karne ke liye yeh list staff ko dikha dein.');

  return lines.join('\n');
}
