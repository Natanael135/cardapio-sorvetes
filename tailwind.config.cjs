/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(45 20% 90%)",
        input: "hsl(45 20% 96%)",
        ring: "hsl(25 100% 50%)",
        background: "hsl(50 100% 98%)",
        foreground: "hsl(25 10% 20%)",
        primary: {
          DEFAULT: "#FFD700",
          foreground: "#8B4513"
        },
        secondary: {
          DEFAULT: "#FFA500",
          foreground: "#FFFFFF"
        },
        accent: {
          DEFAULT: "#FF8C00",
          foreground: "#FFFFFF"
        },
        muted: {
          DEFAULT: "hsl(45 20% 95%)",
          foreground: "hsl(25 10% 40%)"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 2px 16px rgba(255,215,0,0.1)"
      }
    }
  },
  plugins: []
};
