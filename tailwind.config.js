// tailwind.config.js
/** @type {import("tailwindcss").Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      boxShadow: {
        glass: "0 18px 50px rgba(0,0,0,.25)",
        "ios-card": "0 18px 50px rgba(0,0,0,0.38)",
        "ios-card-soft": "0 10px 28px rgba(0,0,0,0.26)",
        "ios-card-inset":
          "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.35)",
        "ios-nav": "0 22px 70px rgba(0,0,0,0.45)",
      },
      fontFamily: {
        ios: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};