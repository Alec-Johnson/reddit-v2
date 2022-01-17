module.exports = {
  purge: ['./src/**/*.tsx'],
  darkMode: false,
  theme: {
    fontFamily: {
      body: ['IBM Plex Sans', 'sans-serif'],
    },
    extend: {
      colors: {
        blue: {
          100: '#cce4f6',
          200: '#99c9ed',
          300: '#66afe5',
          400: '#3394dc',
          500: '#0079d3',
          600: '#0061a9',
          700: '#00497f',
          800: '#003054',
          900: '#00182a',
        },
      },
      spacing: {
        160: '40rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
