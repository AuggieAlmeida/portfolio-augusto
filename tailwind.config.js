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
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764'
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e'
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
          '0%, 100%': { opacity: '1', transform: 'scale(1)', filter: 'drop-shadow(0 0 2px rgb(99 102 241 / 0.3))' },
          '50%': { opacity: '0.85', transform: 'scale(1.05)', filter: 'drop-shadow(0 0 5px rgb(168 85 247 / 0.5))' }
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
          '0%, 100%': { backgroundImage: 'linear-gradient(135deg, rgb(99 102 241), rgb(168 85 247))', boxShadow: '0 0 10px rgb(99 102 241 / 0.3)' },
          '50%': { backgroundImage: 'linear-gradient(135deg, rgb(168 85 247), rgb(217 70 239))', boxShadow: '0 0 20px rgb(168 85 247 / 0.5)' }
        },
        'text-glow': {
          '0%, 100%': { color: 'rgb(99 102 241)', textShadow: '0 0 5px rgb(99 102 241 / 0.3)' },
          '50%': { color: 'rgb(168 85 247)', textShadow: '0 0 10px rgb(168 85 247 / 0.5)' }
        },
        'border-pulse': {
          '0%, 100%': { borderColor: 'rgb(199 210 254)', boxShadow: '0 0 5px rgb(99 102 241 / 0.2)' },
          '50%': { borderColor: 'rgb(165 180 252)', boxShadow: '0 0 15px rgb(99 102 241 / 0.4)' }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgb(99 102 241 / 0.3)',
        'glow-lg': '0 0 40px rgb(168 85 247 / 0.4)',
        'inner-glow': 'inset 0 0 20px rgb(99 102 241 / 0.2)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, rgb(99 102 241), rgb(168 85 247))',
        'gradient-secondary': 'linear-gradient(135deg, rgb(168 85 247), rgb(217 70 239))',
        'gradient-accent': 'linear-gradient(135deg, rgb(217 70 239), rgb(192 38 211))'
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
          background: 'linear-gradient(135deg, rgb(99 102 241), rgb(168 85 247))',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-gradient-secondary': {
          background: 'linear-gradient(135deg, rgb(168 85 247), rgb(217 70 239))',
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
