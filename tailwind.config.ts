import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/components/Navbar.jsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#55C15C',
        secondary: '#43A2CB',
        offwhite: '#D9D9D9',
        dark: '#1E1E1E',
      },
    },
  },
  plugins: [],
} satisfies Config