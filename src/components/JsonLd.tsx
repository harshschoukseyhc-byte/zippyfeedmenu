import React from 'react';
import { menuData } from '@/lib/menu-data';

export const JsonLd: React.FC = () => {
  const cuisines = [
    'Korean',
    'North Indian',
    'South Indian',
    'Chinese',
    'Italian',
    'Continental',
    'Momos',
    'Fast Food',
    'Desserts',
    'Beverages',
  ];

  const menuSections = menuData.sections.map((section) => {
    const allItems = section.groups.flatMap((group) => group.items);
    return {
      '@type': 'MenuSection',
      name: section.name,
      description: `${section.name} selection at Zippyfeed Bhopal`,
      hasMenuItem: allItems.map((item) => {
        const itemPrice = item.price ?? (item.variants ? Math.min(...Object.values(item.variants)) : 0);
        return {
          '@type': 'MenuItem',
          name: item.name,
          description: item.desc || undefined,
          suitableForDiet: item.veg ? 'https://schema.org/VegetarianDiet' : undefined,
          offers: {
            '@type': 'Offer',
            price: itemPrice,
            priceCurrency: 'INR',
          },
        };
      }),
    };
  });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://zippyfeed.in/#restaurant',
    name: 'Zippyfeed Cafe & Fine Dine',
    alternateName: ['Zippyfeed', 'Zippyfeed Bhopal', 'Zippyfeed Outlet 120'],
    description:
      'Two-floor multi-cuisine cafe & family restaurant on Narmadapuram Road, opposite Aashima Mall, Bhopal. Dedicated pure veg and non-veg kitchens, Korean street food, Pocket Friendly Combos from ₹299, Neapolitan pizza, North Indian curries, and mocktails.',
    url: 'https://zippyfeed.in',
    telephone: '+919183485102',
    image: 'https://zippyfeed.in/og-image.png',
    servesCuisine: cuisines,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Opposite Aashima Mall, Narmadapuram Road',
      addressLocality: 'Bhopal',
      addressRegion: 'Madhya Pradesh',
      postalCode: '462026',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '11:00',
        closes: '23:00',
      },
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Separate Pure Veg & Non-Veg Kitchens', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Two Floors with Family Seating', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Elevator / Lift Access', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parking Available', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Dine-in, Takeaway, Drive-Through', value: true },
    ],
    hasMenu: {
      '@type': 'Menu',
      '@id': 'https://zippyfeed.in/#menu',
      name: 'Zippyfeed Bhopal Digital QR Menu',
      url: 'https://zippyfeed.in',
      inLanguage: ['en', 'hi'],
      hasMenuSection: menuSections,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
