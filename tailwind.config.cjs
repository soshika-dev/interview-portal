/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'IRANSans', 'Tahoma', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 30px -18px rgba(15, 23, 42, 0.35)',
        'soft-md': '0 18px 40px -24px rgba(15, 23, 42, 0.4)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        avagostar: {
          primary: '#0b4f5c',
          secondary: '#4a5568',
          accent: '#6fd3de',
          neutral: '#1f2933',
          'base-100': '#f7f5f2',
          'base-200': '#efebe6',
          'base-300': '#e3ded7',
          info: '#4f8edc',
          success: '#2f9e78',
          warning: '#d9a441',
          error: '#e05c5c'
        }
      }
    ]
  }
}
