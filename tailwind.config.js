/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'soft-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.01)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-1deg)' },
          '75%': { transform: 'rotate(1deg)' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        marquee: 'marquee 25s linear infinite',
        'soft-pulse': 'soft-pulse 2.6s ease-in-out infinite',
        wiggle: 'wiggle 0.35s ease-in-out',
      }
    },
  },
  plugins: [],
}

