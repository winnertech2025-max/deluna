import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        champagne: "#ff8a00",
        linen: "#fff7ed",
        nude: "#ffd7ad",
        ink: "#161412",
        cocoa: "#6f4b2f"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(117, 56, 11, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
