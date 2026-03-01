import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },

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
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        soft: "0 4px 20px rgba(233, 106, 141, 0.15)",
        "soft-lg": "0 8px 40px rgba(233, 106, 141, 0.2)",
        glow: "0 0 30px rgba(247, 182, 194, 0.4)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
      backgroundImage: {
        "gradient-peony": "linear-gradient(135deg, #FFE4E1 0%, #F7B6C2 50%, #E96A8D 100%)",
        "gradient-peony-dark": "linear-gradient(135deg, #E96A8D 0%, #C2185B 50%, #AD1457 100%)",
        "gradient-soft": "linear-gradient(180deg, #FFF8F6 0%, #FDECEF 100%)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
