import React from 'react';
import { RestaurantInfo } from '@/types/menu';

interface AboutBlockProps {
  restaurant: RestaurantInfo;
  lang?: 'en' | 'hi';
}

export const AboutBlock: React.FC<AboutBlockProps> = ({ restaurant, lang = 'en' }) => {
  const isHi = lang === 'hi';

  const amenities = [
    {
      icon: '🏢',
      title: isHi ? 'दो मंज़िला रेस्टोरेंट' : 'Two Floors & Lift',
      desc: isHi ? 'लिफ्ट सुविधा के साथ खुला पारिवारिक डाइनिंग' : 'Spacious seating across two floors with elevator',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: isHi ? 'पारिवारिक माहौल' : 'Family Seating',
      desc: isHi ? 'ग्रुप और फैमिली के लिए आरामदायक व्यवस्था' : 'Comfortable booths and tables for family gatherings',
    },
    {
      icon: '🅿️',
      title: isHi ? 'पार्किंग सुविधा' : 'Dedicated Parking',
      desc: isHi ? 'रेस्टोरेंट के ठीक सामने सुरक्षित पार्किंग' : 'Easy parking right outside Paras Hermitage',
    },
    {
      icon: '🥗',
      title: isHi ? 'अलग वेज और नॉन-वेज किचन' : 'Separate Kitchens',
      desc: isHi ? 'शुद्ध शाकाहारी और मांसाहारी के लिए अलग तैयारी' : 'Veg and non-veg food prepared with strict segregation',
    },
    {
      icon: '🚗',
      title: isHi ? 'डाइन-इन व ड्राइव-थ्रू' : 'All Dining Modes',
      desc: isHi ? 'डाइन-इन · टेकअवे · डिलीवरी · ड्राइव-थ्रू' : 'Dine-in · Takeaway · Delivery · Drive-through',
    },
    {
      icon: '⏰',
      title: isHi ? 'समय: 11 AM – 11 PM' : '11 AM – 11 PM Daily',
      desc: isHi ? 'सातों दिन खुला · केवल मॉकटेल (अल्कोहल मुक्त)' : 'Open all days · Mocktails only (no alcohol)',
    },
  ];

  return (
    <section
      aria-label="About Zippyfeed Bhopal"
      className="w-full max-w-xl mx-auto px-4 py-8"
    >
      <div className="bg-white/80 rounded-3xl p-5 sm:p-6 border border-zippy-paperBorder shadow-xs">
        {/* Header */}
        <div className="text-center pb-4 border-b border-zippy-paperBorder/80">
          <span className="text-[11px] font-bold uppercase tracking-widest text-zippy-gold">
            {isHi ? 'हमारे बारे में' : 'About Zippyfeed'}
          </span>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-zippy-maroon mt-1">
            {restaurant.name}
          </h2>
          <p className="text-xs text-zippy-muted mt-1 max-w-md mx-auto">
            {restaurant.outlet} · {restaurant.landmark}
          </p>
        </div>

        {/* Features / Amenities Grid */}
        <div className="grid grid-cols-2 gap-3.5 pt-4">
          {amenities.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-zippy-paper/70 border border-zippy-paperBorder/60 flex flex-col justify-between"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div>
                <h3 className="font-sans font-bold text-xs text-zippy-ink leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-zippy-muted leading-tight mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
