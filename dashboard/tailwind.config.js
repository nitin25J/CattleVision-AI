/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FBF8F1",
        ecru: "#F7F4EC",
        forest: {
          DEFAULT: "#173B2B",
          deep: "#163C2D",
          dark: "#0F261C",
          mid: "#2E5B41",
          light: "#3A6E52",
        },
        wheat: {
          light: "#FDF8ED",
          DEFAULT: "#F4E2B8",
          amber: "#D97706",
          dark: "#B4772E",
        },
        sage: {
          light: "#EEF3EA",
          DEFAULT: "#C5D8BE",
          border: "#D3DFCC",
        },
        neutralBorder: "#E5E0D5",
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Fraunces', 'Merriweather', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(22, 41, 30, 0.04), 0 1px 2px -1px rgba(22, 41, 30, 0.04)",
        cardHover: "0 10px 25px -5px rgba(22, 41, 30, 0.08), 0 8px 10px -6px rgba(22, 41, 30, 0.04)",
        glass: "0 8px 32px 0 rgba(22, 60, 45, 0.15)",
      },
    },
  },
  plugins: [],
}
