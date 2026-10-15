import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        background: "#09090b",
        foreground: "#ececef",
        panel: {
          DEFAULT: "#111114",
          2: "#17171b",
          3: "#1e1e23",
        },
        line: {
          DEFAULT: "#232328",
          2: "#303037",
        },
        muted: "#8b8b95",
        dim: "#5a5a63",
        accent: {
          DEFAULT: "#8f8cff",
          soft: "#b4b2ff",
          deep: "#5f5bd6",
        },
        rec: "#ff5a5a",
        // Alias kept so any leftover `primary` utility still matches the new palette
        primary: {
          DEFAULT: "#8f8cff",
          light: "#b4b2ff",
          dark: "#5f5bd6",
        },
        border: "#232328",
      },
      borderRadius: {
        lg: "10px",
        md: "7px",
        sm: "4px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
