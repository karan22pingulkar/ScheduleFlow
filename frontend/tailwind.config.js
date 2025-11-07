/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBg: "#0f0f1a",
        neonBlue: "#6366f1",
        neonTeal: "#14b8a6",
      },
    },
  },
  plugins: [],
}

