/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Changed to a clean, modern font
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        surface: {
          0: '#f8f6ff',
          1: '#ffffff',
          2: '#f1edf8',
          3: '#ded7ea',
          4: '#6d6577',
        },
        accent: {
          blue:   '#4f8ef7',
          violet: '#8b5cf6',
          amber:  '#f59e0b',
          green:  '#10b981',
          red:    '#ef4444',
          cyan:   '#06b6d4',
          ink:    '#15121b',
          mint:   '#62dcbf',
          coral:  '#ff6f61',
        },
        border: 'rgba(34,29,43,0.10)',
      },
      boxShadow: {
        card: '0 18px 48px rgba(39, 27, 67, 0.12)',
        soft: '0 24px 70px rgba(39, 27, 67, 0.14)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' },
        },
      },
    },
  },
  plugins: [],
}
