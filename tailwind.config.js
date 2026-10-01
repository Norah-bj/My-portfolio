/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0d12',
        ink2: '#10131a',
        bone: '#e8e9ee',
        mute: '#8a8f9d',
        faint: '#4a4f5c',
        ice: '#9db9ff',
        violet: '#b79bff',
      },
      fontFamily: {
        disp: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      keyframes: {
        'scroll-hint': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
      },
      animation: {
        'scroll-hint': 'scroll-hint 2.2s cubic-bezier(0.65,0,0.35,1) infinite',
      },
    },
  },
  plugins: [],
}
