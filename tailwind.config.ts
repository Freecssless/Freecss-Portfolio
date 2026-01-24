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
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: '#0b0c1d',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#36a9a1',
          light: '#4ecdc4',
          dark: '#2d8f88',
        },
        secondary: {
          DEFAULT: '#5068c8',
          light: '#6b7fd4',
        },
        card: {
          DEFAULT: '#0f1225',
          border: '#1a1f3c',
        },
        muted: '#8b8fa8',
        border: '#1a1f3c',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
