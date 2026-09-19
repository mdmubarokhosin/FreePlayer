/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'class' — flipping <html class="dark"> flips all `dark:` variants.
  darkMode: 'class',
  // Purge only the HTML files that actually use Tailwind classes.
  // Paths are RELATIVE TO THE tw-build/ DIRECTORY (that's where the
  // Tailwind CLI runs from). `../` goes up to the project root, where
  // index.html / embed.html / 404.html live.
  content: [
    '../index.html',
    '../embed.html',
    '../404.html',
  ],
  theme: {
    extend: {
      colors: {
        // Two-tier palette per token: light (default) + dark variant.
        // Usage: `bg-base` for light, `dark:bg-base-dark` for dark.
        base:     { DEFAULT: '#f6f8fc', dark: '#0a0f1e' },
        elevated: { DEFAULT: '#ffffff', dark: '#121a2e' },
        card:     { DEFAULT: '#ffffff', dark: '#0f1626' },
        // Surface = translucent overlay — different opacity per theme.
        surface:  { DEFAULT: 'rgba(17, 20, 45, 0.04)', dark: 'rgba(255, 255, 255, 0.05)' },
        primary:  { DEFAULT: '#0a0f1e', dark: '#f4f5fb' },
        secondary:{ DEFAULT: '#4b5266', dark: '#b8bcd0' },
        tertiary: { DEFAULT: '#7a8298', dark: '#8a8fa8' },
        accent:   { DEFAULT: '#6c5dd3', hover: '#5a4dc0', dark: '#7c6cf0' },
        border:   { DEFAULT: 'rgba(17, 20, 45, 0.09)', dark: 'rgba(255, 255, 255, 0.08)' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'accent-grad': 'linear-gradient(135deg, #8a7cf2 0%, #6c5dd3 100%)',
      },
      boxShadow: {
        'glow': '0 8px 30px rgba(124, 108, 240, 0.25)',
        'glow-dark': '0 0 60px rgba(124, 108, 240, 0.25)',
      },
    },
  },
  plugins: [],
};
