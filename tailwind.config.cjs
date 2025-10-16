/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(210 20% 90%)",
        input: "hsl(210 20% 96%)",
        ring: "hsl(340 82% 52%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 47.4% 11.2%)",
        primary: {
          DEFAULT: "#e11d48",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "hsl(210 20% 98%)",
          foreground: "hsl(215 16.3% 46.9%)"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 2px 16px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};
