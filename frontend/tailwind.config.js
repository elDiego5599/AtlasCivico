/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mineral: {
          light: '#ECE9E1',
          DEFAULT: '#ECE9E1',
        },
        ivory: {
          DEFAULT: '#F6F4EE',
        },
        graphite: {
          DEFAULT: '#1F2937',
        },
        'slate-warm': {
          DEFAULT: '#6B7280',
        },
        'soft-stone': {
          DEFAULT: '#D6D3CD',
        },
        civic: {
          500: '#4C6A92',
          600: '#3D5A80',
          400: '#5E81AC',
        },
        sage: {
          500: '#6F8F72',
          600: '#5A7A5D',
          400: '#89A98D',
        },
        terracotta: {
          DEFAULT: '#B08968',
        },
        'clay-red': {
          DEFAULT: '#B86B5E',
        },
        'warm-amber': {
          DEFAULT: '#C9A66B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(31, 41, 55, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'glass-lg': '0 16px 48px rgba(31, 41, 55, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'mineral': '0 25px 45px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'float-medium': 'float-medium 14s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'fade-up-delay-1': 'fade-up 0.8s ease-out 0.2s forwards',
        'fade-up-delay-2': 'fade-up 0.8s ease-out 0.4s forwards',
        'fade-up-delay-3': 'fade-up 0.8s ease-out 0.6s forwards',
        'fade-up-delay-4': 'fade-up 0.8s ease-out 0.8s forwards',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(30px, -20px, 0) scale(1.05)' },
          '66%': { transform: 'translate3d(-20px, 15px, 0) scale(0.95)' },
        },
        'float-medium': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-25px, 30px, 0) scale(1.08)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
