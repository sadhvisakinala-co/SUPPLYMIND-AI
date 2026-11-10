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
        midnight: "#0B3048",
        deep: "#071F30",
        pearl: "#F2F0E9",
        lime: "#B9F12F",
        // Midnight Teal / Soft Pearl / Neon Lime. Legacy aliases preserve existing components.
        graphite: "#0B3048",
        charcoal: "#12394F",
        surface: "#19455A",
        "electric-teal": "#B9F12F",
        "steel-teal": "#90A9AF",
        "soft-ivory": "#F2F0E9",
        "silver-sage": "#B8C9CC",
        "border-subtle": "rgba(242, 240, 233, 0.12)",

        // Palette aliases for compatibility
        obsidian: "#0B3048",
        "deep-forest": "#12394F",
        "champagne-gold": "#B9F12F", // Upgraded to Electric Teal
        "warm-ivory": "#F2F0E9",
        "muted-sage": "#B8C9CC",

        // Semantic states
        success: "#B9F12F",
        warning: "#E1AD68",
        error: "#E37D7D",

        // shadcn/ui variables
        border: "#2E5063",
        input: "#2E5063",
        ring: "#B9F12F",
        background: "#0B3048",
        foreground: "#F2F0E9",
        primary: {
          DEFAULT: "#B9F12F",
          foreground: "#0B3048",
        },
        secondary: {
          DEFAULT: "#12394F",
          foreground: "#F2F0E9",
        },
        destructive: {
          DEFAULT: "#E37D7D",
          foreground: "#F2F0E9",
        },
        muted: {
          DEFAULT: "#90A9AF",
          foreground: "#B8C9CC",
        },
        accent: {
          DEFAULT: "#B9F12F",
          foreground: "#0B3048",
        },
        card: {
          DEFAULT: "#12394F",
          foreground: "#F2F0E9",
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
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(185, 241, 47, 0.4))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 5px rgba(185, 241, 47, 0.1))" },
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
