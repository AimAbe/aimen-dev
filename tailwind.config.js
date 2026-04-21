const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: 'var(--bg)',
          card: 'var(--surface)',
          hover: 'var(--surface2)',
        },
        border: {
          DEFAULT: 'var(--border)',
          hover: 'var(--border)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          muted: 'rgba(232,184,75,0.12)',
        },
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
          dim: 'var(--muted)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top-2': {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        in: 'fade-in 0.15s ease-out, slide-in-from-top-2 0.15s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = config
