/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#111827", // Dark gray/almost black
          hover: "#1f2937",
        },
        secondary: {
          DEFAULT: "#4f46e5", // Indigo
          hover: "#4338ca",
        },
        accent: {
          DEFAULT: "#ef4444", // Red
          hover: "#dc2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        hover:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
