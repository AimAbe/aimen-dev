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
          DEFAULT: '#0a0a10',
          card: '#13131a',
          hover: '#1a1a24',
        },
        border: {
          DEFAULT: '#1e1e2a',
          hover: '#2a2a3a',
        },
        accent: {
          DEFAULT: '#c8ff57',
          muted: 'rgba(200,255,87,0.1)',
        },
        text: {
          DEFAULT: '#e4e2ef',
          muted: '#6b6880',
          dim: '#4a4860',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
