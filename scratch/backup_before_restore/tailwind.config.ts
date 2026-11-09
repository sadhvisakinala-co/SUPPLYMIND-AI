import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── EXACT DARK FINTECH LUXURY REFERENCE PALETTE ───────────────────
        "primary-bg": "#061011",
        background: "#061011",
        foreground: "#F4F7F4",

        "surface-main": "#0B191B",
        "surface-secondary": "#102326",
        "surface-elevated": "#173034",

        // Aliases for layout compatibility
        surface: "#0B191B",
        secondary: {
          DEFAULT: "#102326",
          foreground: "#F4F7F4",
        },
        sidebar: "#0B191B",
        card: {
          DEFAULT: "#0B191B",
          foreground: "#F4F7F4",
        },
        elevated: "#173034",
        "deep-emerald": "#176D5B",

        // Mint Accents
        "primary-mint": "#79E7C7",
        "accent-mint": "#4ED8AF",
        accent: {
          DEFAULT: "#79E7C7",
          foreground: "#061011",
        },
        primary: {
          DEFAULT: "#79E7C7",
          foreground: "#061011",
        },
        jade: "#79E7C7",
        "electric-teal": "#79E7C7",

        // Typography
        "primary-text": "#F4F7F4",
        text: "#F4F7F4",
        "secondary-text": "#A6B8B5",
        "muted-text": "#708784",
        muted: {
          DEFAULT: "#102326",
          foreground: "#A6B8B5",
        },

        // Borders and Glow
        border: "rgba(154, 231, 207, 0.12)",
        "border-atelier": "rgba(154, 231, 207, 0.12)",
        "border-subtle": "rgba(154, 231, 207, 0.12)",
        input: "rgba(154, 231, 207, 0.12)",
        ring: "#79E7C7",

        // Semantic states
        success: "#5FC7A1",
        warning: "#D8AD70",
        error: "#D77979",
        destructive: {
          DEFAULT: "#D77979",
          foreground: "#F4F7F4",
        },
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)", "DM Serif Display", "Georgia", "serif"],
        display: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "IBM Plex Mono", "monospace"],
      },
      fontSize: {
        // Hero headline: 76–88px desktop
        "hero-title": ["clamp(4.75rem, 6vw, 5.5rem)", { lineHeight: "0.96", letterSpacing: "-0.035em" }],
        // Dashboard page titles: 34–40px
        "page-title": ["clamp(2.125rem, 2.75vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        // Section headings: 24–30px
        "section-title": ["clamp(1.5rem, 2.1vw, 1.875rem)", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        // Card title: 20px
        "card-title": ["1.25rem", { lineHeight: "1.35", letterSpacing: "-0.015em" }],
        // Financial metrics: 32–44px
        "financial-value": ["clamp(2rem, 3vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        // Body text: 15–16px
        body: ["1rem", { lineHeight: "1.65" }],
      },
      maxWidth: {
        "8xl": "1440px",
        "9xl": "1600px",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        atelier: "0 1px 3px rgba(0, 0, 0, 0.5), 0 10px 30px -10px rgba(0, 0, 0, 0.7)",
        "atelier-elevated": "0 4px 6px -1px rgba(0, 0, 0, 0.6), 0 24px 48px -15px rgba(0, 0, 0, 0.8)",
        "jade-subtle": "0 0 30px -8px rgba(84, 201, 179, 0.25)",
        "accent-glow": "0 0 40px -10px rgba(84, 201, 179, 0.35)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-scale": "fade-in-scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-subtle": "pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
