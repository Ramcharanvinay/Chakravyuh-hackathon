/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#08090D',
          900: '#050608',
          800: '#08090D',
          700: '#0E1017',
        },
        charcoal: {
          DEFAULT: '#12141B',
          light: '#1A1D27',
          card: '#151722',
          border: '#262A38',
        },
        gold: {
          DEFAULT: '#D8B46A',
          light: '#F0D495',
          dark: '#B08838',
          glow: 'rgba(216, 180, 106, 0.25)',
        },
        ivory: {
          DEFAULT: '#F3E8CF',
          muted: '#C4B9A1',
        },
        bronze: {
          DEFAULT: '#805B36',
          dark: '#543B22',
        },
        ember: {
          DEFAULT: '#D85B45',
          glow: 'rgba(216, 91, 69, 0.3)',
        },
        // Track specific
        agni: {
          DEFAULT: '#E05A47',
          light: '#FF7A63',
          border: '#FF5722',
          glow: 'rgba(224, 90, 71, 0.35)',
        },
        vajra: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          border: '#2563EB',
          glow: 'rgba(59, 130, 246, 0.35)',
        },
        vayu: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          border: '#0891B2',
          glow: 'rgba(6, 182, 212, 0.35)',
        },
        vanam: {
          DEFAULT: '#10B981',
          light: '#34D399',
          border: '#059669',
          glow: 'rgba(16, 185, 129, 0.35)',
        },
        carbon: {
          DEFAULT: '#090A0E',
          deep: '#060709',
          card: '#12141C',
          border: '#1E212D',
          elevated: '#171924',
          subtle: '#252836',
        },
        titanium: {
          DEFAULT: '#F8FAFC',
          light: '#FFFFFF',
          muted: '#94A3B8',
          dark: '#64748B',
        },
        crimson: {
          DEFAULT: '#FF3B30',
          light: '#FF5B52',
          dark: '#DC2626',
        },
        surya: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          border: '#D97706',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
      },
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        inter: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 90s linear infinite',
        'spin-reverse-slow': 'spin-reverse 110s linear infinite',
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 35s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          'from': { transform: 'rotate(360deg)' },
          'to': { transform: 'rotate(0deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'monolith': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'monolith-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        'tactical': '0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
