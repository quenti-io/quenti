/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        slate: {
          250: "#D7DFE9",
          750: "#293548",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
