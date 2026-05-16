const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       'var(--bg)',
        'bg-2':   'var(--bg-2)',
        surface:  'var(--surface)',
        border:   'var(--border)',
        fg:       'var(--fg)',
        'fg-2':   'var(--fg-2)',
        'fg-3':   'var(--fg-3)',
        'fg-4':   'var(--fg-4)',
        accent:   'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        ok:       'var(--ok)',
        warn:     'var(--warn)',
        err:      'var(--err)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Mono', 'ui-monospace', 'monospace'],
        sans: ['JetBrains Mono', 'Fira Mono', 'ui-monospace', 'monospace'],
        serif: ['JetBrains Mono', 'Fira Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

module.exports = config
