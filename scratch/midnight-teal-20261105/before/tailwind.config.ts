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
        // Master Graphite & Electric Teal Theme
        graphite: "#101719",
        charcoal: "#162326",
        surface: "#213236",
        "electric-teal": "#26B7A3",
        "steel-teal": "#6E9293",
        "soft-ivory": "#EBF4F3",
        "silver-sage": "#A5B8B8",
        "border-subtle": "#34494C",

        // Palette aliases for compatibility
        obsidian: "#101719",
        "deep-forest": "#162326",
        "champagne-gold": "#26B7A3", // Upgraded to Electric Teal
        "warm-ivory": "#EBF4F3",
        "muted-sage": "#A5B8B8",

        // Semantic states
        success: "#4BC59A",
        warning: "#E1AD68",
        error: "#E37D7D",

        // shadcn/ui variables
        border: "#34494C",
        input: "#34494C",
        ring: "#26B7A3",
        background: "#101719",
        foreground: "#EBF4F3",
        primary: {
          DEFAULT: "#26B7A3",
          foreground: "#101719",
        },
        secondary: {
          DEFAULT: "#162326",
          foreground: "#EBF4F3",
        },
        destructive: {
          DEFAULT: "#E37D7D",
          foreground: "#EBF4F3",
        },
        muted: {
          DEFAULT: "#6E9293",
          foreground: "#A5B8B8",
        },
        accent: {
          DEFAULT: "#26B7A3",
          foreground: "#101719",
        },
        card: {
          DEFAULT: "#162326",
          foreground: "#EBF4F3",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["clamp(3.5rem, 6vw, 5.5rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "heading-section": ["clamp(2.25rem, 4vw, 3.25rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "heading-card": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "metric-value": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        "body-base": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption-tech": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.05em" }],
      },
      maxWidth: {
        "8xl": "1440px",
        "9xl": "1600px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(38, 183, 163, 0.4))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 5px rgba(38, 183, 163, 0.1))" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
