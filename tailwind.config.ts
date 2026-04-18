import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-low': 'hsl(var(--surface-low))',
        'surface-high': 'hsl(var(--surface-high))',
        'surface-soft': 'hsl(var(--surface-soft))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        line: 'hsl(var(--line))',
        observation: 'hsl(var(--observation))',
        reflection: 'hsl(var(--reflection))',
        peach: 'hsl(var(--peach))',
        mint: 'hsl(var(--mint))',
        sun: 'hsl(var(--sun))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))'
      },
      fontFamily: {
        sans: ['IBM Plex Sans KR', 'Apple SD Gothic Neo', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        display: ['IBM Plex Sans KR', 'Apple SD Gothic Neo', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        data: ['Geist Mono', 'IBM Plex Mono', 'monospace']
      },
      boxShadow: {
        sanctuary: '0 18px 42px rgba(32, 38, 34, 0.08)',
        ambient: '0 10px 28px rgba(32, 38, 34, 0.07)',
        float: '0 16px 34px rgba(32, 38, 34, 0.1)'
      },
      borderRadius: {
        xl: '0.5rem',
        '2xl': '0.5rem',
        '3xl': '0.5rem',
        '4xl': '0.5rem'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.75', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
        rise: 'rise 0.5s ease-out both',
        'pulse-soft': 'pulseSoft 3.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
