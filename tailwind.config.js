/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'p-blue': '#0015ff',
      },
      typography: {
        DEFAULT: {
          css: {
            'line-height': '20px',
            'font-size': '14px',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
