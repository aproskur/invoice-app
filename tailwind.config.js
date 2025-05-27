/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // enable dark mode using `.dark` class
    content: [
      './src/**/*.{js,ts,jsx,tsx}', // adjust to match your folders
      './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {
        colors: {
          background: 'hsl(var(--background-hsl))',
          foreground: 'hsl(var(--foreground-hsl))',
          primary: 'hsl(var(--primary-hsl))',
          'primary-light': 'hsl(var(--primary-light-hsl))',
          danger: 'hsl(var(--danger-hsl))',
          'danger-soft': 'hsl(var(--danger-soft-hsl))',
          muted: 'hsl(var(--text-muted-hsl))',
          accent: 'hsl(var(--text-accent-hsl))',
          'panel-dark': 'hsl(var(--panel-dark-hsl))',
          'panel-darker': 'hsl(var(--panel-darker-hsl))',
          'grayish': 'hsl(var(--text-muted-hsl))',
          border: 'hsl(var(--border-light-hsl))',
          'extra-dark': 'hsl(var(--extra-dark-hsl))',


        },
        fontFamily: {
          sans: ['var(--font-sans)'],
          mono: ['var(--font-mono)'],
        },
        keyframes: {
          'slide-in-left': {
            '0%': { transform: 'translateX(-100%)', opacity: '0' },
            '100%': { transform: 'translateX(0)', opacity: '1' },
          },
        },
        animation: {
          'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
        },
      },
    },
    plugins: [],
  };
  