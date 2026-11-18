/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0B1120",
          card: "#131C31",
          cardBorder: "#1E293B",
          accent: "#06B6D4",
          accentHover: "#0891B2",
          textMuted: "#94A3B8",
          success: "#10B981",
          error: "#EF4444",
        }
      }
    },
  },
  plugins: [],
}
