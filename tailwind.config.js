/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5a4632',    // Dark blue
        secondary: '#ffb347',  // Amber
        accent: '#10B981',     // Green
      },
    },
  },
  plugins: [],
}
