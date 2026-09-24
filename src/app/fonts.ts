import localFont from 'next/font/local';

export const fontPlayfair = localFont({
  src: [
    {
      path: '../fonts/playfair-display-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/playfair-display-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
});

export const fontInter = localFont({
  src: [
    {
      path: '../fonts/inter-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/inter-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/inter-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/inter-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const fontBarlowCondensed = localFont({
  src: [
    {
      path: '../fonts/barlow-condensed-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/barlow-condensed-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-barlow-condensed',
  display: 'swap',
});
