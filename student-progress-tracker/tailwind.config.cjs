/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    fontFamily: {
      sans: ['sf-pro-display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['sf-mono', 'Fira Code', 'Menlo', 'monospace'],
    },
    extend: {
      colors: {
        background: '#040404', // Ultra dark matte
        surface: '#0A0A0A',    // Slightly lighter dark
        'surface-highlight': '#121212',
        border: 'rgba(255, 255, 255, 0.06)',
        
        // Accents - Controlled & Muted
        primary: {
          DEFAULT: '#10b981', // Emerald 500
          glow: 'rgba(16, 185, 129, 0.4)',
          dim: 'rgba(16, 185, 129, 0.1)',
        },
        accent: {
          DEFAULT: '#06b6d4', // Cyan 500
          glow: 'rgba(6, 182, 212, 0.4)',
          dim: 'rgba(6, 182, 212, 0.1)',
        },
        danger: {
          DEFAULT: '#f43f5e', // Rose 500
          dim: 'rgba(244, 63, 94, 0.1)',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(16, 185, 129, 0.1)',
        'glow-md': '0 0 20px rgba(16, 185, 129, 0.2)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
