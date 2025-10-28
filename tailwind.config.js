/** @type {import('tailwindcss').Config} */
exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        "primary-light": "#a78bfa",
        secondary: "#f87171",
        "bg-base": "#0a0d14",
        "text-main": "#e2e8f0",
        "text-secondary": "#9ca3af",
      },
      backgroundColor: {
        "app-base": "var(--color-bg-base)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
