/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ye line saari React files ko scan karegi
  ],
  theme: {
    extend: {
      // Yahan aap apne custom colors (e.g., brand primary) add kar sakte hain
    },
  },
  plugins: [],
}