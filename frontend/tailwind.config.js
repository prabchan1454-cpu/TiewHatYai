/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
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
        glow: "0 0 20px 4px var(--tw-shadow-color)",
        "glow-sm": "0 0 10px 2px var(--tw-shadow-color)",
        "inner-glow": "inset 0 0 24px 0 var(--tw-shadow-color)",
      },
      backgroundImage: {
        "rarity-rare": "linear-gradient(135deg, #1e3a5f 0%, #0d2137 100%)",
        "rarity-epic": "linear-gradient(135deg, #2d1b4e 0%, #1a0d30 100%)",
        "rarity-legendary": "linear-gradient(135deg, #4a2c0a 0%, #2a1500 100%)",
        "quest-dark": "linear-gradient(180deg, #0e1a2e 0%, #0a1220 100%)",
        "quest-light": "linear-gradient(180deg, #f0f5ff 0%, #e8f0fe 100%)",
        "hero-mesh": "radial-gradient(ellipse at top, #1b3a6b 0%, #0e1525 60%)",
        "hero-mesh-light": "radial-gradient(ellipse at top, #dceefb 0%, #f0f4fc 60%)",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "badge-reveal": "badge-reveal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
        "float-up": "float-up 0.4s ease-out forwards",
        "stamp-pop": "stamp-pop 0.55s cubic-bezier(0.34,1.8,0.64,1) forwards",
        "sparkle-fly": "sparkle-fly 0.65s ease-out forwards",
        "quest-flash": "quest-flash 0.6s ease-out forwards",
        "xp-float": "xp-float 0.8s ease-out forwards",
      },
      keyframes: {
        "glow-pulse": {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "badge-reveal": {
          from: { transform: "scale(0.5) rotate(-15deg)", opacity: "0" },
          to: { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "stamp-pop": {
          "0%":   { transform: "scale(1)",    boxShadow: "0 0 0px rgba(255,176,32,0)" },
          "35%":  { transform: "scale(1.45)", boxShadow: "0 0 28px rgba(255,176,32,0.9)" },
          "65%":  { transform: "scale(0.92)", boxShadow: "0 0 14px rgba(255,176,32,0.5)" },
          "100%": { transform: "scale(1)",    boxShadow: "0 0 10px rgba(255,176,32,0.3)" },
        },
        "sparkle-fly": {
          "0%":   { transform: "scale(0) translate(0,0)", opacity: "1" },
          "60%":  { opacity: "1" },
          "100%": { transform: "scale(1.2) translate(var(--sx,18px),var(--sy,-18px))", opacity: "0" },
        },
        "quest-flash": {
          "0%":   { opacity: "0", transform: "scale(0.85)" },
          "30%":  { opacity: "1", transform: "scale(1.06)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "xp-float": {
          "0%":   { transform: "translateY(0)",   opacity: "1" },
          "100%": { transform: "translateY(-32px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
