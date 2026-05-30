import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        foreground: "#020617",
        accent: {
          DEFAULT: "#0ea5e9",
          glow: "rgba(14, 165, 233, 0.15)",
        },
        surface: "#ffffff",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      boxShadow: {
        neon: "0 10px 30px -10px rgba(14, 165, 233, 0.3)",
        "neon-strong": "0 10px 40px -10px rgba(14, 165, 233, 0.5)",
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};

export default config;
