/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // FIX: Override default Tailwind breakpoints to add xs:375px and set sm to 480px
    screens: {
      'xs':  '375px',
      'sm':  '480px',
      'md':  '768px',
      'lg':  '1024px',
      'xl':  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: "#6C47FF",
        coral:   "#FF6B6B",
        teal:    "#00D4AA",
        navy:    "#1A1A2E",
      },
      // FIX: Verified — Space Grotesk and Inter present
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body:    ["'Inter'",         "sans-serif"],
      },
    },
  },
  plugins: [],
};
