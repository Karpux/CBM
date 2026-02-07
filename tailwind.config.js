/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      colors: {
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        elevated: 'rgb(var(--color-elevated) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        brand: 'rgb(var(--color-brand) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        hero: 'rgb(var(--color-hero) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 16px 45px -30px rgb(15 23 42 / 0.5)',
        glow: '0 10px 30px -12px rgb(var(--color-brand) / 0.6)',
      },
      backgroundImage: {
        halo: 'radial-gradient(circle at 20% 20%, rgb(var(--color-brand) / 0.15), transparent 55%), radial-gradient(circle at 80% 10%, rgb(var(--color-accent) / 0.2), transparent 45%)',
        mesh: 'radial-gradient(circle at 10% 20%, rgb(var(--color-accent) / 0.16), transparent 40%), radial-gradient(circle at 70% 10%, rgb(var(--color-brand) / 0.22), transparent 35%), radial-gradient(circle at 80% 80%, rgb(var(--color-brand) / 0.18), transparent 45%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
}
