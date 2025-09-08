/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155', 
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },  
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        display: ['Great Vibes', 'cursive'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 6s ease-in-out infinite 2s',
        'float-slow': 'float-slow 8s ease-in-out infinite 1s',
        'gradient-pulse': 'gradient-pulse 2s ease-in-out infinite',
        'text-glow': 'text-glow 2s ease-in-out infinite',
        'border-pulse': 'border-pulse 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'pulse-slow': {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scale(1)', 
            filter: 'drop-shadow(0 0 2px rgb(34 197 94 / 0.3))' 
          },
          '50%': { 
            opacity: '0.92', 
            transform: 'scale(1.05)', 
            filter: 'drop-shadow(0 0 8px rgb(22 163 74 / 0.4))'
          }
        },
        'pulse-mobile': {
          '0%, 100%': { 
            opacity: '1', 
            transform: 'scaleY(2)', 
            filter: 'drop-shadow(0 0 4px rgb(34 197 94 / 0.4))' 
          },
          '50%': { 
            opacity: '0.95', 
            transform: 'scaleY(2.5)', 
            filter: 'drop-shadow(0 0 12px rgb(22 163 74 / 0.6))'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-5px) rotate(5deg)' },
          '66%': { transform: 'translateY(-3px) rotate(-3deg)' }
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-7px) rotate(-5deg)' },
          '66%': { transform: 'translateY(-4px) rotate(3deg)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(8deg)' },
          '50%': { transform: 'translateY(-5px) rotate(-5deg)' },
          '75%': { transform: 'translateY(-6px) rotate(3deg)' }
        },
        'gradient-pulse': {
          '0%, 100%': { backgroundImage: 'linear-gradient(135deg, rgb(34 197 94), rgb(22 163 74))', boxShadow: '0 0 10px rgb(34 197 94 / 0.3)' },
          '50%': { backgroundImage: 'linear-gradient(135deg, rgb(22 163 74), rgb(21 128 61))', boxShadow: '0 0 20px rgb(22 163 74 / 0.5)' }
        },
        'text-glow': {
          '0%, 100%': { color: 'rgb(34 197 94)', textShadow: '0 0 5px rgb(34 197 94 / 0.3)' },
          '50%': { color: 'rgb(22 163 74)', textShadow: '0 0 10px rgb(22 163 74 / 0.5)' }
        },
        'border-pulse': {
          '0%, 100%': { borderColor: 'rgb(187 247 208)', boxShadow: '0 0 5px rgb(34 197 94 / 0.2)' },
          '50%': { borderColor: 'rgb(134 239 172)', boxShadow: '0 0 15px rgb(34 197 94 / 0.4)' }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgb(34 197 94 / 0.3)',
        'glow-lg': '0 0 40px rgb(22 163 74 / 0.4)',
        'inner-glow': 'inset 0 0 20px rgb(34 197 94 / 0.2)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, rgb(34 197 94), rgb(22 163 74))',
        'gradient-secondary': 'linear-gradient(135deg, rgb(22 163 74), rgb(21 128 61))',
        'gradient-accent': 'linear-gradient(135deg, rgb(21 128 61), rgb(20 83 45))'
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          background: 'linear-gradient(135deg, rgb(34 197 94), rgb(22 163 74))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-secondary': {
          background: 'linear-gradient(135deg, rgb(22 163 74), rgb(21 128 61))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.bg-glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }
      addUtilities(newUtilities)
    },
    function({ addVariant }) {
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)')
      addVariant('motion-reduce', '@media (prefers-reduced-motion: reduce)')
    }
  ],
}