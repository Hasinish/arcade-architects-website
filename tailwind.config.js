/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bloom3D Measured Color System
        bloom: {
          bg: '#F7F7F7',            // Core stone/paper light background
          text: '#2E2E2E',          // Primary charcoal text
          muted: 'rgba(46, 46, 46, 0.4)', // Secondary muted text
          hairline: 'rgba(46, 46, 46, 0.12)', // Subtle divider lines
          black: '#121212',         // Deep obsidian for media sections
          darkCard: '#222222',      // Button background in drawer
          accent: '#E45D36',        // Subtle brand accent
          white: '#FFFFFF',
        },
        background: '#F7F7F7',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Helvetica Now"', '"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Helvetica Now"', '"Plus Jakarta Sans"', '"Inter"', 'sans-serif']
      },
      letterSpacing: {
        'tight-bloom': '-0.5px',
        'tighter-bloom': '-1.5px',
      },
      transitionTimingFunction: {
        'bloom-ease': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'bloom-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
