/** @type {import("tailwindcss").Config} */
export default {
  darkMode: ["class"], // html bekommt "dark"
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      boxShadow: {
        // Legacy (falls alte Komponenten noch da sind)
        neu: "12px 12px 24px rgba(0,0,0,.08), -12px -12px 24px rgba(255,255,255,.9)",
        "neu-inset":
          "inset 10px 10px 20px rgba(0,0,0,.10), inset -10px -10px 20px rgba(255,255,255,.85)",
        glass: "0 18px 50px rgba(0,0,0,.25)",

        // iOS-like (neu)
        "ios-card": "0 18px 50px rgba(0,0,0,0.35)",
        "ios-card-soft": "0 10px 28px rgba(0,0,0,0.25)",
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