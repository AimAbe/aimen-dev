const config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './lib/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: 'var(--bg)', card: 'var(--bg2)', hover: 'var(--line)' },
        border: { DEFAULT: 'var(--line)', hover: 'var(--fg3)' },
        accent: { DEFAULT: 'var(--accent)', muted: 'color-mix(in srgb, var(--accent) 14%, transparent)' },
        text: { DEFAULT: 'var(--fg)', muted: 'var(--fg2)', dim: 'var(--fg3)' },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        serif: ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-in-from-top-2': { '0%': { transform: 'translateY(-8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: { in: 'fade-in 0.15s ease-out, slide-in-from-top-2 0.15s ease-out' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = config
