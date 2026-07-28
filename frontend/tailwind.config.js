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
        darkBg: "#080B14",
        darkBgCard: "#0D1117",
        darkBorder: "rgba(30, 41, 59, 0.45)",
        darkText: "#E4E4E7",
        darkTextMuted: "#94A3B8",
        primary: {
          DEFAULT: '#6366f1', // Indigo
          hover: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#8b5cf6', // Violet
          hover: '#7c3aed',
        },
        accent: {
          DEFAULT: '#06b6d4', // Cyan
          hover: '#0891b2',
        },
        electricBlue: '#3b82f6',
        purpleGlow: '#a855f7',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(135deg, #0f172a 0%, #080B14 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
