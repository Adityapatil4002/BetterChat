import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000", // Pure black for the main background
        surface: "#09090b", // Very dark grey (Zinc 950) for cards/sections
        border: "#27272a", // Dark grey (Zinc 800) for subtle borders
        primary: "#ffffff", // Pure white for headings
        secondary: "#a1a1aa", // Muted grey (Zinc 400) for subtext
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
