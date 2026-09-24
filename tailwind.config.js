/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zippy: {
          red: '#E1251B',
          maroon: '#9E0E16',
          gold: '#C9A227',
          paper: '#FBF6EC',
          paperDarker: '#F5ECE0',
          paperBorder: '#E8DCC6',
          ink: '#1A1A1A',
          muted: '#6B655B',
          veg: '#1B8E3E',
          nonVeg: '#7A3B12',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        condensed: ['var(--font-barlow-condensed)', 'Barlow Condensed', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
