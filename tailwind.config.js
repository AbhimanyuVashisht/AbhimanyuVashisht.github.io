/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="light"]'],
  theme: {
    extend: {
      colors: {
        'bg-main': 'var(--bg-main)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-accent': 'var(--bg-accent)',
        'text-main': 'var(--text-main)',
        'text-secondary': 'var(--text-secondary)',
        accent: 'var(--accent)',
        'accent-bg': 'var(--accent-bg)',
        'card-bg': 'var(--card-bg)',
        'border-color': 'var(--border-color)',
      },
      fontFamily: {
        inter: ['Inter', 'Arial', 'sans-serif'],
        montserrat: ['Montserrat', 'Inter', 'Arial', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        stripeShift: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' }
        },
        drawLogo: {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' }
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'stripe-shift': 'stripeShift 6s linear infinite',
        'draw-logo': 'drawLogo 2s ease forwards'
      },
      borderRadius: {
        '34': '34%',
        '32': '32%',
      },
      boxShadow: {
        'profile': '0 12px 32px rgba(0,0,0,0.18)',
        'card': '0 12px 32px rgba(0,0,0,0.18)',
        'navbar': '0 0.125rem 0.25rem rgba(0,0,0,.075)',
      }
    },
  },
  plugins: [],
}
