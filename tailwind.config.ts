import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        champagne: "#d8bd7f",
        linen: "#fbf6ee",
        nude: "#ead8c7",
        ink: "#161412",
        cocoa: "#675849"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(36, 26, 18, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
