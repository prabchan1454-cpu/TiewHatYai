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
        canvas: "#f6f7fb",
      },
      fontFamily: {
        sans: ["'Noto Sans Thai'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(27 42 74 / 0.04), 0 1px 3px 0 rgb(27 42 74 / 0.06)",
        lift: "0 4px 16px -4px rgb(27 42 74 / 0.12)",
        hero: "0 12px 32px -8px rgb(27 42 74 / 0.35)",
      },
    },
  },
  plugins: [],
};
