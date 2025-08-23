/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        },
        kabbalah: {
          gold: '#D4AF37',
          lightGold: '#F4E99C',
          deepBlue: '#1e3a8a',
          royalBlue: '#2563eb',
          purple: '#7c3aed',
          lightPurple: '#a855f7',
          cosmic: '#312e81',
          mystic: '#4c1d95',
          divine: '#581c87',
          celestial: '#6366f1',
          ethereal: '#8b5cf6',
          sacred: '#059669'
        },
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706'
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        hebrew: ['Frank Ruehl Libre', 'Times New Roman', 'serif'],
        display: ['Cinzel', 'serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-left': 'slideLeft 0.6s ease-out',
        'slide-right': 'slideRight 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 8s linear infinite',
        'scale-pulse': 'scalePulse 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgb(212 175 55 / 0.5)' },
          '50%': { boxShadow: '0 0 40px rgb(212 175 55 / 0.8)' }
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgb(212 175 55 / 0.3)',
        'glow-lg': '0 0 40px rgb(212 175 55 / 0.4)',
        'mystical': '0 10px 50px rgba(124, 58, 237, 0.3)',
        'divine': '0 0 30px rgba(88, 28, 135, 0.5)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-kabbalah': 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #D4AF37 100%)',
        'gradient-mystical': 'linear-gradient(45deg, #312e81, #4c1d95, #581c87)'
      },
      screens: {
        'xs': '475px'
      }
    },
  },
  plugins: [],
}