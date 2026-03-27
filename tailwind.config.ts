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
        sans: ['Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Pretendard', 'Apple SD Gothic Neo', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        sanctuary: '0 28px 70px rgba(47, 51, 50, 0.08)',
        ambient: '0 16px 42px rgba(47, 51, 50, 0.06)',
        float: '0 24px 56px rgba(141, 76, 74, 0.14)'
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
        '4xl': '3rem'
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
