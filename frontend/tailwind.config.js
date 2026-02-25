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
        serif: ['Lora', 'Georgia', 'ui-serif', 'serif'],
      },
      colors: {
        editorial: {
          black: '#0a0a0a',
          ink: '#171717',
          muted: '#525252',
          border: '#e5e5e5',
          red: '#991b1b',
          'red-dark': '#7f1d1d',
          'red-muted': '#fef2f2',
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
        DEFAULT: '#e5e5e5',
      },
    },
  },
  plugins: [],
};
