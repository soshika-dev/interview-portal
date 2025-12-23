/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'sans-serif']
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        avagostar: {
          primary: '#0f6c7b',
          secondary: '#1b3a57',
          accent: '#17a2b8',
          neutral: '#1f2937',
          'base-100': '#f8fafc',
          'base-200': '#eef2f6',
          'base-300': '#dfe7ef',
          info: '#38bdf8',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444'
        }
      }
    ]
  }
}
