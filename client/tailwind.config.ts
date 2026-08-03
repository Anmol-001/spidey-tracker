import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#05070a',
          900: '#0a0d14',
          850: '#0f1420',
          800: '#141b2d',
          750: '#1b243b',
          700: '#232f4c',
          600: '#324268',
        },
        spider: {
          50: '#fff0f3',
          100: '#ffe2e8',
          200: '#ffc9d6',
          300: '#ff9fb8',
          400: '#ff648f',
          500: '#ff2a5f',
          600: '#e60f47',
          700: '#c20436',
          800: '#a20630',
          900: '#870a2c',
        },
        web: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        cyber: {
          neon: '#00f3ff',
          alert: '#ff0055',
          radar: '#00ff88',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
