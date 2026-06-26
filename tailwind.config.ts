import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sky:   { 50:'#E8FAFD', 200:'#B7EEF7', 300:'#5FDAEC', 500:'#1FC4DE', 700:'#1796AB' },
        coral: { 50:'#FDECF1', 200:'#FAC3D3', 400:'#F58BA8', 500:'#F0719B', 700:'#D94F7E' },
        ink:   { 900:'#2C2C30', 700:'#56565B', 400:'#9A9AA0' },
        line:  '#ECECEE',
        'bg-soft': '#F7F7F8',
        pastel: { cream:'#FBF3DB', blue:'#DEE9F3', blush:'#FBE9EF', powder:'#DCEAF5', lilac:'#ECE4F2', mint:'#DCF1EB' },
        // shadcn/ui compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      fontFamily: {
        heading: ['Bitter', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        pill: '999px',
        DEFAULT: 'var(--radius)',
      },
      boxShadow: {
        sm:    '0 2px 8px rgba(44,44,48,.08)',
        card:  '0 10px 30px rgba(44,44,48,.10)',
        coral: '0 6px 16px rgba(245,139,168,.36)',
        sky:   '0 6px 16px rgba(31,196,222,.32)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
