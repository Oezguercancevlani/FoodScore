/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",           // Root-HTML (falls vorhanden)
    "./src/**/*.{js,jsx,ts,tsx}" // alle Dateien in src mit JS/TS/JSX/TSX-Endung
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
