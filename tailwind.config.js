/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#EFF8FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#0A84FF',
          700: '#0066CC',
          800: '#075985',
          900: '#0C4A6E',
        },
        surface: {
          base: '#FFFFFF',
          subtle: '#F2F2F7',
          raised: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#1C1C1E',
          secondary: '#3A3A3C',
          tertiary: '#8E8E93',
          quaternary: '#C7C7CC',
        },
        success: '#34C759',
        warning: '#FF9F0A',
        error: '#FF3B30',
        accent: '#5856D6',
      },
      borderRadius: {
        card: '1.5rem',
        xl2: '1.75rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -8px rgba(0,0,0,0.10)',
        cardHover: '0 2px 6px rgba(0,0,0,0.06), 0 16px 40px -12px rgba(0,0,0,0.16)',
        nav: '0 -1px 0 rgba(0,0,0,0.04), 0 -6px 24px -8px rgba(0,0,0,0.08)',
        soft: '0 1px 2px rgba(0,0,0,0.04)',
        focus: '0 0 0 4px rgba(10,132,255,0.25)',
      },
      spacing: {
        safe: 'env(safe-area-inset-top, 0px)',
        'safe-b': 'env(safe-area-inset-bottom, 0px)',
      },
      maxWidth: {
        app: '480px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        press: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
        scaleIn: 'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
        press: 'press 0.25s ease',
        rise: 'rise 0.5s cubic-bezier(0.22,1,0.36,1) both',
        pop: 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
};
