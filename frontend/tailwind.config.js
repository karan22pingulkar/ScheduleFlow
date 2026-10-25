/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05060f",
        darkBg: "#05060f",
        neonBlue: "#6366f1",
        neonTeal: "#14b8a6",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 18s linear infinite",
        float: "float 7s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(139, 92, 246, 0.55)",
        "glow-sm": "0 0 22px -6px rgba(99, 102, 241, 0.5)",
      },
    },
  },
  plugins: [],
}
