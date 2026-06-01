/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sunset: "#ff7a45",
        mango: "#ffb020",
        lagoon: "#0fb9b1",
        deep: "#1b2a4a",
      },
      fontFamily: {
        thai: ["'Noto Sans Thai'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
