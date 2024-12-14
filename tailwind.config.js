/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'kormelink': ['WTKormelink', 'serif']
      },
      fontFeatureSettings: {
        'swash': '"swsh" 1'
      }
    }
  },
  plugins: []
}
