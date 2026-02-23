/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"], // Tailwind Dark-Mode per .dark Klasse am <html>  :contentReference[oaicite:0]{index=0}
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        // “Raised” Soft-UI (Neumorphismus)
        neu: "12px 12px 24px rgba(0,0,0,.08), -12px -12px 24px rgba(255,255,255,.9)",
        // “Pressed” Soft-UI (Inset)
        "neu-inset":
          "inset 10px 10px 20px rgba(0,0,0,.10), inset -10px -10px 20px rgba(255,255,255,.85)",
        // Dark glass shadow
        glass: "0 18px 50px rgba(0,0,0,.25)",
      },
    },
  },
  plugins: [],
};