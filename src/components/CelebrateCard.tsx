import React from 'react';
import { CelebrateInfo, RestaurantInfo } from '@/types/menu';
import { trackOutboundTap } from '@/lib/analytics';

interface CelebrateCardProps {
  celebrate: CelebrateInfo;
  restaurant: RestaurantInfo;
  lang?: 'en' | 'hi';
}

export const CelebrateCard: React.FC<CelebrateCardProps> = ({
  celebrate,
  restaurant,
  lang = 'en',
}) => {
  const isHi = lang === 'hi';

  const enquiryMessage = encodeURIComponent(
    `Hi ${restaurant.name}, I would like to enquire about hosting a celebration (birthday/kitty party/get-together) at your restaurant.`
  );
  const whatsappUrl = `https://wa.me/${restaurant.whatsapp}?text=${enquiryMessage}`;

  return (
    <section
      aria-label="Celebrate with us"
      className="w-full max-w-xl mx-auto px-4 py-4"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/15 via-red-500/10 to-stone-900/10 p-5 sm:p-6 border border-zippy-gold/40 shadow-xs">
        {/* Subtle decorative motif */}
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-15 pointer-events-none select-none">
          🎉
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-zippy-gold font-bold text-xs uppercase tracking-wider">
            <span>✦</span>
            <span>{isHi ? 'उत्सव और पार्टी' : 'Host Events'}</span>
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-zippy-maroon mt-1 leading-snug">
            {celebrate.title}
          </h3>

          <p className="text-xs text-zippy-ink/80 mt-1.5 leading-relaxed max-w-md">
            {celebrate.text}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-2 my-3.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-zippy-ink border border-zippy-gold/30">
              🎂 {isHi ? 'बर्थडे पार्टी' : 'Birthdays'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-zippy-ink border border-zippy-gold/30">
              ☕ {isHi ? 'किट्टी पार्टी' : 'Kitty Parties'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-zippy-ink border border-zippy-gold/30">
              👨‍👩‍👧‍👦 {isHi ? 'फैमिली गेट-टुगेदर' : 'Family Gatherings'}
            </span>
          </div>

          {/* WhatsApp Enquiry Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundTap('whatsapp', 'celebrate_card')}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zippy-red hover:bg-zippy-maroon active:scale-[0.99] text-white font-sans font-bold text-xs shadow-md transition-all"
          >
            <svg
              className="w-4 h-4 fill-current flex-shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.006.58 2.051.883 3.033.883 3.181 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.766-5.768-5.766zm9.73 5.766c-.001 5.39-4.385 9.774-9.773 9.774-1.636 0-3.238-.409-4.664-1.189l-5.324 1.396 1.42-5.187c-.854-1.48-1.305-3.176-1.305-4.794.001-5.39 4.385-9.774 9.773-9.774 5.39 0 9.773 4.384 9.773 9.774z" />
            </svg>
            <span>{celebrate.cta}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
