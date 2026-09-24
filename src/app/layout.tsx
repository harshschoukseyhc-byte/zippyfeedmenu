import type { Metadata, Viewport } from 'next';
import './globals.css';
import { fontPlayfair, fontInter, fontBarlowCondensed } from './fonts';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { JsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL('https://zippyfeed.in'),
  title: 'Zippyfeed Menu Bhopal | Cafe & Restaurant Opp. Aashima Mall',
  description:
    'Explore 329 dishes across 11 cuisines at Zippyfeed Bhopal (Outlet #120, Narmadapuram Road, opposite Aashima Mall). Korean street food, combos from ₹299, Neapolitan pizza, North Indian & pure veg options.',
  keywords: [
    'Zippyfeed menu Bhopal',
    'restaurant menu Narmadapuram Road',
    'cafe near Aashima Mall',
    'Zippyfeed Bhopal',
    'Korean food Bhopal',
    'digital menu Bhopal',
    'family restaurant Bhopal',
    'pure veg food Bhopal',
  ],
  authors: [{ name: 'Zippyfeed Bhopal' }],
  creator: 'Zippyfeed Bhopal',
  publisher: 'Zippyfeed Bhopal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Zippyfeed Cafe & Fine Dine | Digital Menu Bhopal',
    description:
      'Explore 329 dishes across 11 cuisines at Zippyfeed Bhopal (Opposite Aashima Mall). Korean delicacies, pocket friendly combos from ₹299, pizzas & pure veg options.',
    url: 'https://zippyfeed.in',
    siteName: 'Zippyfeed Bhopal',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zippyfeed Cafe & Fine Dine Bhopal Menu',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zippyfeed Cafe & Fine Dine | Digital Menu Bhopal',
    description:
      'Explore 329 dishes across 11 cuisines at Zippyfeed Bhopal (Opposite Aashima Mall). Korean delicacies, combos from ₹299, pizzas & pure veg options.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    shortcut: '/icon-192.png',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zippyfeed',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#9E0E16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontPlayfair.variable} ${fontInter.variable} ${fontBarlowCondensed.variable}`}
    >
      <body className="bg-zippy-paper text-zippy-ink antialiased selection:bg-zippy-red/10 selection:text-zippy-red">
        <JsonLd />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
