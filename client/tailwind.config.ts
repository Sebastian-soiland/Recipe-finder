import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Fredoka", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        peach: {
          50: "#fef5f0",
          100: "#fde8dd",
          200: "#fdd0bb",
        },
        mint: {
          200: "#a8f0d8",
          300: "#7ce8c8",
          400: "#50e0b0",
        },
        lilac: {
          200: "#e8d5f2",
          300: "#dbb8e8",
        },
        yellow: {
          200: "#ffd699",
          300: "#ffcc66",
        },
      },
      dropShadow: {
        lg: "2px 2px 0px rgba(0, 0, 0, 0.3)",
        sm: "1px 1px 0px rgba(0, 0, 0, 0.2)",
      },
      boxShadow: {
        lg: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
