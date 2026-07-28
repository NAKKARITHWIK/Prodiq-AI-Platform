/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#3b82f6',
          500: '#1e3a8a', // Blackish Blue
          600: '#172554', // Darker Blackish Blue
          700: '#0f172a',
          900: '#020617',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          400: '#ef4444',
          500: '#7f1d1d', // Blackish Red
          600: '#450a0a', // Darker Blackish Red
          700: '#2a0606',
          900: '#000000',
        },
        // Override slate with Zinc/Matte Black values
        slate: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b', // Matte Black base
        }
      },
    },
  },
  plugins: [],
}
