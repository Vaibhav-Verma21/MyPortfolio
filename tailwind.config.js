/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#FFFDF5',
          black: '#000000',
          accent: '#FF6B6B',
          secondary: '#FFD93D',
          muted: '#C4B5FD',
        }
      },
      boxShadow: {
        'neo-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-md': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}