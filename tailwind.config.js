/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "'Arial Black'", 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        field: {
          sky: '#1B3A6B',
          skyLight: '#2E5EA8',
          grass: '#1A6B2E',
          grassLight: '#2D8A45',
          dirt: '#8B5E3C',
          navy: '#0F1E3A',
          gold: '#F5C842',
          goldDark: '#C9A227',
          chalk: '#F8F4E8',
        }
      },
      backgroundImage: {
        'stadium': 'linear-gradient(180deg, #0a1628 0%, #1B3A6B 35%, #1A6B2E 100%)',
        'card': 'linear-gradient(135deg, #0F1E3A 0%, #162440 100%)',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'ball-throw': 'ballThrow 0.6s ease-in-out',
        'confetti-fall': 'confettiFall 1s ease-in forwards',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    }
  },
  plugins: []
}
