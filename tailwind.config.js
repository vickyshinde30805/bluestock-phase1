/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Open Sans", "sans-serif"],
      },
      colors: {
        brand: {
          black: "#222222",
          blue: "#414BEA",
          purple: "#7752FE",
          indigo: "#190482",
          bg: "#F6F5F5",
          white: "#FFFFFF",
          lightBlue: "#D9E2FF",
          orange: "#F05537",
        },
      },
    },
  },
  plugins: [],
};
