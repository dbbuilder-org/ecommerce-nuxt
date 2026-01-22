/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts,jsx,tsx}",
    "./layouts/**/*.{vue,js,ts,jsx,tsx}",
    "./pages/**/*.{vue,js,ts,jsx,tsx}",
    "./composables/**/*.{js,ts}",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Custom screen breakpoint to match Start.vue SCSS media query
    screens: {
      'sm': '640px',
      'md': '812px', // Custom breakpoint matching original SCSS
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      // V2 Design System: Soft shadows
      boxShadow: {
        'soft-sm': 'var(--shadow-soft-sm, 0 1px 4px -1px rgba(0,0,0,0.04), 0 2px 8px -2px rgba(0,0,0,0.06))',
        'soft': 'var(--shadow-soft, 0 2px 8px -2px rgba(0,0,0,0.05), 0 4px 20px -4px rgba(0,0,0,0.08))',
        'soft-lg': 'var(--shadow-soft-lg, 0 8px 30px -6px rgba(0,0,0,0.12))',
        'soft-xl': 'var(--shadow-soft-xl, 0 12px 40px -8px rgba(0,0,0,0.15))',
        'glow-primary': 'var(--shadow-glow-primary, 0 4px 14px 0 rgba(12,133,182,0.4))',
        'glow-primary-lg': 'var(--shadow-glow-primary-lg, 0 6px 20px 0 rgba(12,133,182,0.5))',
        'glow-accent': 'var(--shadow-glow-accent, 0 4px 14px 0 rgba(153,34,34,0.35))',
        'glow-accent-lg': 'var(--shadow-glow-accent-lg, 0 6px 20px 0 rgba(153,34,34,0.45))',
        'glow-success': 'var(--shadow-glow-success, 0 4px 14px 0 rgba(105,152,100,0.35))',
      },
      // V2 Design System: Background gradients
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary, linear-gradient(to bottom, #0c85b6, #0a6b94))',
        'gradient-accent': 'var(--gradient-accent, linear-gradient(to bottom, #992222, #7a1b1b))',
        'gradient-success': 'var(--gradient-success, linear-gradient(to bottom, #699864, #527a4e))',
        'gradient-surface': 'var(--gradient-surface, linear-gradient(to bottom, #ffffff, #fafafa))',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0c85b6',
          600: '#0a6b94',
          700: '#085172',
          800: '#063750',
          900: '#041d2e',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Windermere V2 colors
        navy: {
          dark: '#0a1628',
          DEFAULT: '#132238',
          light: '#1a2d47',
        },
        teal: {
          300: '#5eead4',
          400: '#00d4c4',
          DEFAULT: '#00b4a6',
          500: '#00a094',
          600: '#0d9488',
        },
        coral: {
          light: '#ff8c5a',
          DEFAULT: '#ff6b35',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "pulse-once": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-in",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-in",
        "pulse-once": "pulse-once 0.4s ease-in-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
}
