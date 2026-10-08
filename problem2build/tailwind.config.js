/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#06080f",
        surface: "#0b1326",
        "surface-container-lowest": "#060e20",
        "surface-container-low": "#0d121f",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        "surface-container-highest": "#2d3449",
        "surface-variant": "#2d3449",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#e0c0b1",
        "inverse-surface": "#dae2fd",
        "inverse-on-surface": "#283044",

        // Primary: The Itch Spark
        primary: "#ffb690",
        "primary-container": "#f97316",
        "on-primary": "#552100",
        "on-primary-container": "#582200",
        "primary-fixed": "#ffdbca",
        "primary-fixed-dim": "#ffb690",

        // Secondary: Validation / Resolution
        secondary: "#4edea3",
        "secondary-container": "#00a572",
        "secondary-fixed": "#6ffbbe",
        "secondary-fixed-dim": "#4edea3",
        "on-secondary": "#003824",
        "on-secondary-container": "#00311f",

        // Tertiary: Developer Context & Telemetry
        tertiary: "#8c9cb4",
        "tertiary-container": "#8c9cb4",
        "tertiary-fixed": "#d3e4fe",
        "tertiary-fixed-dim": "#b7c8e1",
        "on-tertiary": "#213145",

        // System
        outline: "#a78b7d",
        "outline-variant": "#584237",
        error: "#ffb4ab",
        "error-container": "#93000a",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        margin: "2rem",
        "margin-mobile": "1rem",
        gutter: "1.5rem",
        "gutter-mobile": "1rem",
      },
      boxShadow: {
        glow: "0 0 20px -3px rgba(249, 115, 22, 0.35)",
        "glow-green": "0 0 20px -3px rgba(78, 222, 163, 0.35)",
      },
    },
  },
  plugins: [],
};
