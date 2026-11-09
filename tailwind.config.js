/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0e',
        surface: '#151517',
        'surface-elevated': '#1d1d20',
        'surface-border': '#27272a',
        'subtle-border': 'rgba(255, 255, 255, 0.08)',
        accent: {
          DEFAULT: '#e45d36',
          hover: '#f16d47',
          light: '#fbece8'
        },
        bloom: {
          dark: '#121212',
          card: '#1a1a1a',
          border: '#2e2e2e',
          textMuted: '#888888',
          textLight: '#f5f5f7'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif']
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}

