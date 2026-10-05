/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#f0f1f5',
          100: '#e1e3eb',
          200: '#c3c7d7',
          300: '#a5abc3',
          400: '#878faf',
          500: '#69739b',
          600: '#545c7c',
          700: '#3f455d',
          800: '#2a2e3e',
          900: '#15171f',
          950: '#0a0b10',
        },
        saffron: {
          50:  '#fff8ed',
          100: '#ffefd4',
          200: '#ffdda8',
          300: '#ffc56b',
          400: '#ffa234',
          500: '#ff8208',
          600: '#f06500',
          700: '#c74e02',
          800: '#9e3d0b',
          900: '#7f340c',
        },
        surface: {
          DEFAULT: '#fafaf8',
          raised:  '#ffffff',
          sunken:  '#f0f0ec',
          dark:    '#11131a',
          'dark-raised': '#1a1d27',
          'dark-sunken': '#0b0d13',
        },
        success: '#059669',
        warning: '#d97706',
        error:   '#dc2626',
        info:    '#2563eb',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body:    ['Inter', 'sans-serif'],
        hindi:   ['Noto Sans Devanagari', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.75rem',
      },
      boxShadow: {
        'soft':  '0 2px 8px -2px rgba(21,23,31,0.08), 0 4px 16px -4px rgba(21,23,31,0.04)',
        'lift':  '0 4px 16px -4px rgba(21,23,31,0.12), 0 8px 32px -8px rgba(21,23,31,0.08)',
        'glow':  '0 0 20px -4px rgba(255,130,8,0.25)',
        'glow-lg': '0 0 40px -8px rgba(255,130,8,0.35)',
      },
      animation: {
        'shimmer':  'shimmer 2s linear infinite',
        'float':    'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
