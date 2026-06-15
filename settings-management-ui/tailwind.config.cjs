/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          light: '#F5E6A8',
          DEFAULT: '#D4AF37',
          hover: '#FFD700',
        },
        surface: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#EBEBEB',
          
          700: '#1C1C1C',
          800: '#141414',
          900: '#0B0B0B',
        },
        text: {
          main: '#FFFFFF',
          secondary: '#B3B3B3',
        },
        border: {
          gold: 'rgba(212,175,55,0.25)',
          goldLight: 'rgba(212,175,55,0.18)',
        }
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #0B0B0B, #141414, #1C1C1C)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #F5E6A8)',
      },
      boxShadow: {
        'gold-btn': '0 8px 24px rgba(212,175,55,0.25)',
        'gold-btn-hover': '0 12px 30px rgba(255,215,0,0.35)',
        'glass-card': '0 8px 32px rgba(0,0,0,0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};