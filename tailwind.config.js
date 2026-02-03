/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff5f7",
          100: "#ffe8ed",
          200: "#ffd6e0",
          300: "#ffb8ca",
          400: "#ff8aa8",
          500: "#ff4d85",
          600: "#ff1a6b",
          700: "#e60054",
          800: "#bf0047",
          900: "#9c003c",
        },
        accent: {
          pink: "#ff4da6",
          lavender: "#e6d5ff",
          rose: "#ff6b9d",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 32px -4px rgba(255, 77, 166, 0.2), 0 4px 16px -2px rgba(255, 77, 166, 0.1)",
        "card-hover":
          "0 12px 40px -4px rgba(255, 77, 166, 0.3), 0 6px 20px -2px rgba(255, 77, 166, 0.15)",
        button: "0 4px 14px -2px rgba(255, 77, 166, 0.4)",
      },
      backgroundImage: {
        "gradient-blush":
          "linear-gradient(135deg, #fff5f7 0%, #ffe8ed 50%, #ffd6e0 100%)",
        "gradient-card": "linear-gradient(145deg, #ffffff 0%, #fff8fa 100%)",
        "gradient-button": "linear-gradient(135deg, #ff6b9d 0%, #ff4da6 100%)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        sparkle: "sparkle 0.6s ease-out forwards",
        "heart-drift": "heart-drift 4s ease-in-out infinite",
        blink: "blink 4s ease-in-out infinite",
        "stamp-in": "stamp-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        sparkle: {
          "0%": { opacity: "0", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "scale(1) rotate(180deg)" },
        },
        "heart-drift": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.6" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(-20px) scale(0.8)", opacity: "0" },
        },
        blink: {
          "0%, 45%, 55%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.1)" },
        },
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(0) rotate(-20deg)" },
          "60%": { transform: "scale(1.2) rotate(5deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        squeeze: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.85)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(0) translateY(0)", opacity: "1" },
          "50%": { transform: "scale(1.2) translateY(-10px)" },
          "100%": { transform: "scale(0.8) translateY(-30px)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
