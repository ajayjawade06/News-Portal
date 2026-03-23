/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        editorial: {
          black: '#09090b',     // Deeper, richer zinc-950 black
          ink: '#18181b',       // zinc-900 for text
          muted: '#71717a',     // zinc-500 for secondary text
          border: '#e4e4e7',    // zinc-200 for subtle borders
          red: '#dc2626',       // Vibrant pure red (red-600)
          'red-dark': '#991b1b',// Deep red for hover states
          'red-muted': '#fef2f2',// Soft red background
        },
      },
      fontSize: {
        'headline': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'subhead': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.65' }],
        'caption': ['0.8125rem', { lineHeight: '1.4' }],
      },
      maxWidth: {
        'editorial': '1280px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
      borderColor: {
        DEFAULT: '#e4e4e7',
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 3px rgba(0,0,0,0.02)',
        'premium-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
};
