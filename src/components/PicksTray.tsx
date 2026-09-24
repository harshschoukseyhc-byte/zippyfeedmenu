'use client';

import React, { useState } from 'react';
import { PickedItem, formatWhatsAppOrderText } from '@/types/picks';
import { FoodMark } from './FoodMark';
import { trackTrayAction, trackOutboundTap } from '@/lib/analytics';

interface PicksTrayProps {
  items: PickedItem[];
  restaurantName: string;
  outlet: string;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onClear: () => void;
}

export const PicksTray: React.FC<PicksTrayProps> = ({
  items,
  restaurantName,
  outlet,
  onIncrement,
  onDecrement,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

  if (totalItems === 0) return null;

  const handleOpenTray = () => {
    trackTrayAction('open', totalPrice, totalItems);
    setIsOpen(true);
  };

  const handleShareWhatsApp = () => {
    trackTrayAction('whatsapp', totalPrice, totalItems, items.map((i) => i.name));
    trackOutboundTap('whatsapp', 'tray_list');
    const text = formatWhatsAppOrderText(restaurantName, outlet, items, totalPrice);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 1. Floating Collapsed Bottom Bar */}
      <aside
        aria-label="Picks Tray"
        className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-stone-900/40 to-transparent pointer-events-none"
      >
        <div className="max-w-xl mx-auto pointer-events-auto">
          <div
            onClick={handleOpenTray}
            className="flex items-center justify-between bg-stone-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-800 cursor-pointer active:scale-[0.99] transition-all hover:bg-stone-900"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenTray();
              }
            }}
            aria-label={`View your list, ${totalItems} items, total ₹${totalPrice}`}
          >
            {/* Left: Count & Running Total */}
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zippy-red text-white text-xs font-bold shadow-sm">
                {totalItems}
              </span>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-condensed font-bold text-xl tracking-tight text-white">
                    ₹{totalPrice}
                  </span>
                  <span className="text-[11px] text-stone-400 font-medium">total</span>
                </div>
                <div className="text-[11px] text-zippy-gold font-sans font-medium">
                  Apni list banao ✦
                </div>
              </div>
            </div>

            {/* Right: Action Button */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white tracking-wide transition-colors">
              <span>View List</span>
              <span aria-hidden="true" className="text-sm">▲</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Expanded Modal / Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tray-title"
        >
          <div
            className="bg-zippy-paper w-full max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col border border-zippy-paperBorder overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-zippy-paperBorder bg-white/60">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 id="tray-title" className="font-serif font-bold text-lg text-zippy-ink">
                      Apni list banao
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-zippy-red/10 text-zippy-red">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <p className="text-xs text-zippy-red font-semibold mt-1">
                    Order karne ke liye staff ko dikha dein.
                  </p>
                  <p className="text-[11px] text-zippy-muted mt-0.5">
                    (Yeh sirf table par hisaab lagane ke liye hai — koi online order nahi hota.)
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors ml-2 flex-shrink-0"
                  aria-label="Close tray"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Picked Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-zippy-paperBorder/60">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0 pr-2">
                    <div className="pt-1 flex-shrink-0">
                      <FoodMark veg={item.veg} size={14} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-sans font-semibold text-xs text-zippy-ink leading-snug break-words">
                        {item.name}
                      </h4>
                      {item.variantLabel && (
                        <span className="text-[11px] text-zippy-muted font-medium block">
                          Option: {item.variantLabel}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-zippy-muted">
                        ₹{item.price} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center rounded-lg border border-zippy-paperBorder bg-white shadow-2xs overflow-hidden">
                      <button
                        onClick={() => onDecrement(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200 font-bold text-sm"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-zippy-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onIncrement(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 active:bg-stone-200 font-bold text-sm"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>

                    <span className="font-condensed font-bold text-base text-zippy-red min-w-[50px] text-right">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary & WhatsApp Action */}
            <div className="p-4 bg-white border-t border-zippy-paperBorder space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zippy-muted uppercase font-semibold tracking-wider">
                    Total Hisaab
                  </span>
                  <div className="text-[11px] text-stone-500">Taxes as applicable</div>
                </div>
                <div className="text-right">
                  <span className="font-condensed font-bold text-2xl text-zippy-red tracking-tight">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Share on WhatsApp CTA */}
              <button
                onClick={handleShareWhatsApp}
                className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-sans font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5 fill-current flex-shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.006.58 2.051.883 3.033.883 3.181 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.766-5.768-5.766zm9.73 5.766c-.001 5.39-4.385 9.774-9.773 9.774-1.636 0-3.238-.409-4.664-1.189l-5.324 1.396 1.42-5.187c-.854-1.48-1.305-3.176-1.305-4.794.001-5.39 4.385-9.774 9.773-9.774 5.39 0 9.773 4.384 9.773 9.774z" />
                </svg>
                <span>Share list on WhatsApp</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={onClear}
                  className="text-xs text-stone-500 hover:text-zippy-red hover:underline py-1"
                >
                  Clear list (Khali karein)
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-semibold text-zippy-ink hover:underline py-1"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
