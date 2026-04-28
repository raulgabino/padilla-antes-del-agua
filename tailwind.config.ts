import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#11100d",
        sepia: "#c9a56a",
        paper: "#f1e4cf",
        clay: "#8f6041"
      },
      fontFamily: {
        sans: ["var(--font-sans)"]
      },
      boxShadow: {
        soft: "0 20px 80px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
