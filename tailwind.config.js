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
          0: '#09090b', // zinc-950
          1: '#18181b', // zinc-900
          2: '#27272a', // zinc-800
          3: '#3f3f46', // zinc-700
          4: '#52525b', // zinc-600
        },
        accent: {
          blue:   '#3b82f6', // Clean blue accent
          violet: '#8b5cf6',
          amber:  '#f59e0b',
          green:  '#10b981',
          red:    '#ef4444',
          cyan:   '#06b6d4',
        },
        border: 'rgba(255,255,255,0.08)',
      },
      boxShadow: {
        // Removed glowing shadows for a cleaner minimalist aesthetic
        card: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
