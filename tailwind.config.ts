import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cyber: {
          dark: "#0a0a0f",
          card: "#12121c",
          border: "#1f1f33",
          neon: "#00f0ff",
          purple: "#9d4edd",
          pink: "#ff007f",
          gold: "#ffd166",
        },
      },
      boxShadow: {
        neon: "0 0 20px -5px rgba(157, 78, 221, 0.5)",
        "neon-cyan": "0 0 20px -5px rgba(0, 240, 255, 0.5)",
        "neon-pink": "0 0 20px -5px rgba(255, 0, 127, 0.5)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.8", filter: "drop-shadow(0 0 10px rgba(157, 78, 221, 0.6))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 22px rgba(0, 240, 255, 0.8))" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
