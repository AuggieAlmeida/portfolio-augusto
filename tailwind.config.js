/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065'
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344'
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
        float: 'float 6s ease-in-out infinite',
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
            filter: 'drop-shadow(0 0 2px rgb(99 102 241 / 0.3))'
          },
          '50%': {
            opacity: '0.92',
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 0 8px rgb(79 70 229 / 0.4))'
          }
        },
        'pulse-mobile': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scaleY(2)',
            filter: 'drop-shadow(0 0 4px rgb(99 102 241 / 0.4))'
          },
          '50%': {
            opacity: '0.95',
            transform: 'scaleY(2.5)',
            filter: 'drop-shadow(0 0 12px rgb(79 70 229 / 0.6))'
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
          '0%, 100%': {
            backgroundImage: 'linear-gradient(135deg, rgb(99 102 241), rgb(79 70 229))',
            boxShadow: '0 0 10px rgb(99 102 241 / 0.3)'
          },
          '50%': {
            backgroundImage: 'linear-gradient(135deg, rgb(79 70 229), rgb(67 56 202))',
            boxShadow: '0 0 20px rgb(79 70 229 / 0.5)'
          }
        },
        'text-glow': {
          '0%, 100%': { color: 'rgb(99 102 241)', textShadow: '0 0 5px rgb(99 102 241 / 0.3)' },
          '50%': { color: 'rgb(79 70 229)', textShadow: '0 0 10px rgb(79 70 229 / 0.5)' }
        },
        'border-pulse': {
          '0%, 100%': {
            borderColor: 'rgb(199 210 254)',
            boxShadow: '0 0 5px rgb(99 102 241 / 0.2)'
          },
          '50%': { borderColor: 'rgb(165 180 252)', boxShadow: '0 0 15px rgb(99 102 241 / 0.4)' }
        }
      },
      boxShadow: {
        glow: '0 0 20px rgb(99 102 241 / 0.3)',
        'glow-lg': '0 0 40px rgb(79 70 229 / 0.4)',
        'inner-glow': 'inset 0 0 20px rgb(99 102 241 / 0.2)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246))',
        'gradient-secondary': 'linear-gradient(135deg, rgb(139 92 246), rgb(79 70 229))',
        'gradient-accent': 'linear-gradient(135deg, rgb(79 70 229), rgb(109 40 217))'
      },
      backdropBlur: {
        xs: '2px'
      },
      transitionDuration: {
        2000: '2000ms',
        3000: '3000ms'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-gradient': {
          background: 'linear-gradient(135deg, rgb(99 102 241), rgb(139 92 246))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        },
        '.text-gradient-secondary': {
          background: 'linear-gradient(135deg, rgb(139 92 246), rgb(79 70 229))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text'
        },
        '.bg-glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        '.bg-glass-dark': {
          background: 'rgba(0, 0, 0, 0.2)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      };
      addUtilities(newUtilities);
    },
    function ({ addVariant }) {
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)');
      addVariant('motion-reduce', '@media (prefers-reduced-motion: reduce)');
    }
  ]
};
