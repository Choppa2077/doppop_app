/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF7',
        surface: '#FFFFFF',
        'surface-muted': '#F2F2EE',
        border: '#E6E6E0',
        'text-primary': '#0A0A0A',
        'text-muted': '#6B6B66',
        accent: '#5B5BFF',
        'accent-soft': '#EBEBFF',
        success: '#1FB76A',
        warning: '#FFAA33',
        danger: '#E5484D',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '20px',
        xl: '24px',
      },
      spacing: {
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '7': '56px',
      },
      fontFamily: {
        display: ['SpaceGrotesk_700Bold'],
        sans: ['DMSans_500Medium'],
        'sans-semibold': ['DMSans_600SemiBold'],
      },
    },
  },
  plugins: [],
};
