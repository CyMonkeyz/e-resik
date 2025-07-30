// tailwind.config.cjs should include all your files
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/**/**/*.{js,ts,jsx,tsx}", // Add this for nested folders
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}