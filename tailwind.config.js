/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000", // Pure black
        surface: "#09090b", // Dark grey (Zinc 950)
        border: "#27272a", // Zinc 800
        primary: "#ffffff", // White
        secondary: "#a1a1aa", // Zinc 400
        accent: "#ffffff", // Keeping accent white/grey for the monochrome look (or change to "#3b82f6" for blue)
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite alternate",
        "grow-line": "grow-line 2s ease-out forwards",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { opacity: "0.3", transform: "scale(1)" },
          "100%": { opacity: "0.6", transform: "scale(1.1)" },
        },
        "grow-line": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
    },
  },
  plugins: [],
};
