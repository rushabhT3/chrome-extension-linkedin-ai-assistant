/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./**/*.{ts,tsx}"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        'neon-orange': '#ff6700' // Adjust the hex code to your preferred neon orange color
      }
    }
  }
}
