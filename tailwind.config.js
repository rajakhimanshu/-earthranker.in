/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C47FF",
        coral:   "#FF6B6B",
        teal:    "#00D4AA",
        navy:    "#1A1A2E",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body:    ["'Inter'",         "sans-serif"],
      },
    },
  },
  plugins: [],
};
