import React from 'react';
import { RestaurantInfo } from '@/types/menu';
import { trackOutboundTap } from '@/lib/analytics';

interface FooterProps {
  restaurant: RestaurantInfo;
  priceNote?: string;
  lang?: 'en' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({
  restaurant,
  priceNote = 'All prices in INR. Taxes as applicable.',
  lang = 'en',
}) => {
  const isHi = lang === 'hi';

  return (
    <footer className="w-full max-w-xl mx-auto mt-10 px-4 pt-8 pb-16 border-t border-zippy-paperBorder text-center space-y-6">
      {/* 1. Quick Contact & Navigation Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Phone Tap to Call */}
        <a
          href={`tel:${restaurant.phone}`}
          onClick={() => trackOutboundTap('phone', 'footer')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-zippy-paperBorder hover:border-zippy-red hover:text-zippy-red transition-all min-h-[64px] shadow-2xs group"
        >
          <span className="text-lg mb-1 group-hover:scale-110 transition-transform">📞</span>
          <span className="text-[11px] font-bold text-zippy-ink group-hover:text-zippy-red">
            {isHi ? 'कॉल करें' : 'Call Staff'}
          </span>
          <span className="text-[10px] text-zippy-muted font-mono">{restaurant.phoneDisplay}</span>
        </a>

        {/* WhatsApp Link */}
        <a
          href={restaurant.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackOutboundTap('whatsapp', 'footer')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-zippy-paperBorder hover:border-[#25D366] hover:text-[#25D366] transition-all min-h-[64px] shadow-2xs group"
        >
          <span className="text-lg mb-1 group-hover:scale-110 transition-transform">💬</span>
          <span className="text-[11px] font-bold text-zippy-ink group-hover:text-[#25D366]">
            WhatsApp
          </span>
          <span className="text-[10px] text-zippy-muted">Chat with us</span>
        </a>

        {/* Google Maps Directions */}
        <a
          href={restaurant.maps}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackOutboundTap('directions', 'footer')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-zippy-paperBorder hover:border-zippy-gold hover:text-zippy-maroon transition-all min-h-[64px] shadow-2xs group"
        >
          <span className="text-lg mb-1 group-hover:scale-110 transition-transform">🗺️</span>
          <span className="text-[11px] font-bold text-zippy-ink group-hover:text-zippy-maroon">
            {isHi ? 'रास्ता देखें' : 'Directions'}
          </span>
          <span className="text-[10px] text-zippy-muted">Google Maps</span>
        </a>

        {/* Instagram Profile */}
        <a
          href={restaurant.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackOutboundTap('instagram', 'footer')}
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-zippy-paperBorder hover:border-pink-500 hover:text-pink-600 transition-all min-h-[64px] shadow-2xs group"
        >
          <span className="text-lg mb-1 group-hover:scale-110 transition-transform">📸</span>
          <span className="text-[11px] font-bold text-zippy-ink group-hover:text-pink-600">
            Instagram
          </span>
          <span className="text-[10px] text-zippy-muted">@zippyfeed</span>
        </a>
      </div>

      {/* 2. Restaurant Address & Landmark Details */}
      <div className="bg-white/60 p-4 rounded-2xl border border-zippy-paperBorder/70 text-left space-y-1.5">
        <div className="font-serif font-bold text-sm text-zippy-ink flex items-center justify-between">
          <span>{restaurant.name} ({restaurant.outlet})</span>
          <span className="text-xs text-zippy-gold font-normal">Opp. Aashima Mall</span>
        </div>
        <p className="text-xs text-zippy-muted leading-relaxed">
          {restaurant.address}
        </p>
        <p className="text-[11px] text-stone-500">
          ⏰ {restaurant.hours}
        </p>
      </div>

      {/* 3. Policy & Dietary Notes */}
      <div className="space-y-1">
        <p className="text-xs text-zippy-muted">
          {restaurant.notes}
        </p>
        <p className="text-[11px] text-zippy-muted/80">
          {priceNote}
        </p>
        <div className="text-[11px] font-mono text-zippy-gold font-medium pt-1">
          Menu updated: {restaurant.lastUpdated}
        </div>
      </div>

      {/* 4. Gentle Post-Meal Google Review Nudge (At the very bottom) */}
      <div className="pt-4 border-t border-zippy-paperBorder/60">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 border border-amber-200/60 shadow-2xs">
          <div className="flex justify-center text-amber-500 text-sm mb-1" aria-hidden="true">
            ★★★★★
          </div>
          <h4 className="font-serif font-bold text-sm text-zippy-ink mb-1">
            Khana pasand aaya? Google par review kar dein
          </h4>
          <p className="text-[11px] text-zippy-muted mb-3 max-w-xs mx-auto">
            Aapka ek honest review hamari team ka hausla badhata hai.
          </p>
          <a
            href={restaurant.googleReviewLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundTap('review', 'footer')}
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-5 py-2 rounded-xl bg-zippy-ink hover:bg-black active:scale-[0.98] text-white font-sans font-bold text-xs shadow-sm transition-all"
          >
            <span>Write a Google Review</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
