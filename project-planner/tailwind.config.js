/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:       '#0f1117',
        surface:  '#1a1d27',
        surface2: '#22263a',
        border:   '#2e3347',
        accent:   '#6c8aff',
        accent2:  '#a78bfa',
        success:  '#4ade80',
        warn:     '#fb923c',
        danger:   '#f87171',
        muted:    '#6b7280',
        text:     '#e2e8f0',
      },
    },
  },
  plugins: [],
}