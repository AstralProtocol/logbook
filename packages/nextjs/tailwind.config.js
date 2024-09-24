/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './utils/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  darkTheme: 'dark',
  darkMode: ['selector', "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: '#570df8',
          'primary-content': '#F9FBFF',
          secondary: '#323f61',
          'secondary-content': '#F9FBFF',
          accent: '#4969A6',
          'accent-content': '#F9FBFF',
          neutral: '#F9FBFF',
          'neutral-content': '#385183',
          'base-100': '#FFFFFF',
          'base-200': '#F9FBFF',
          'base-300': '#212638',
          'base-content': '#F9FBFF',
          info: '#D9D9D9',
          success: '#34EEB6',
          warning: '#FFCF72',
          error: '#FF8863',

          '--rounded-btn': '1rem',

          '.tooltip': {
            '--tooltip-tail': '6px',
            '--tooltip-color': 'oklch(var(--p))',
          },
          '.link': {
            textUnderlineOffset: '2px',
          },
          '.link:hover': {
            opacity: '80%',
          },
        },
      },
      {
        dark: {
          primary: '#B799F7',
          'primary-content': '#F9FBFF',
          secondary: '#323f61',
          'secondary-content': '#F9FBFF',
          accent: '#4969A6',
          'accent-content': '#000',
          neutral: '#F9FBFF',
          'neutral-content': '#385183',
          'base-100': '#D9D9D9',
          'base-200': '#F9FBFF',
          'base-300': '#212638',
          'base-content': '#F9FBFF',
          info: '#D9D9D9',
          success: '#34EEB6',
          warning: '#FFCF72',
          error: '#FF8863',

          '--rounded-btn': '1rem',

          '.tooltip': {
            '--tooltip-tail': '6px',
            '--tooltip-color': 'oklch(var(--p))',
          },
          '.link': {
            textUnderlineOffset: '2px',
          },
          '.link:hover': {
            opacity: '80%',
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: '0 0 12px -2px rgb(a a a / 0.05)',
        subtle: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};
