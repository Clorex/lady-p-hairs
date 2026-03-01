/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Peony Blush Custom Colors
        peony: {
          50: "#FFF8F6",
          100: "#FFE4E1",
          200: "#F7B6C2",
          300: "#F4A4B4",
          400: "#E96A8D",
          500: "#D81B60",
          600: "#C2185B",
          700: "#AD1457",
          800: "#880E4F",
          900: "#560027",
        },
        nude: {
          50: "#FFF8F6",
          100: "#FDECEF",
          200: "#F5D5D9",
          300: "#E8B4BA",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(233, 106, 141, 0.15)",
        "soft-lg": "0 8px 40px rgba(233, 106, 141, 0.2)",
        glow: "0 0 30px rgba(247, 182, 194, 0.4)",
      },
      backgroundImage: {
        "gradient-peony": "linear-gradient(135deg, #FFE4E1 0%, #F7B6C2 50%, #E96A8D 100%)",
        "gradient-peony-dark": "linear-gradient(135deg, #E96A8D 0%, #C2185B 50%, #AD1457 100%)",
        "gradient-soft": "linear-gradient(180deg, #FFF8F6 0%, #FDECEF 100%)",
      },
    },
  },
};
