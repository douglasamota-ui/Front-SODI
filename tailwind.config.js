/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*", "./components/**/*.{js,jsx,ts,tsx}", "./app/*"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GoogleSans-Regular"],
        bold: ["GoogleSans-Bold"],
      },
    },
  },
};
