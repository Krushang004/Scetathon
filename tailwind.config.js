/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#06141B',
        'card-bg': '#253745',
        'text-primary': '#CCD0CF',
        'text-secondary': '#9BA8AB',
        'accent': '#4A5C6A',
      },
    },
  },
  plugins: [],
}

