/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Duboka plava – povjerenje i sigurnost
        brand: {
          50: '#EEF4FB',
          100: '#D9E7F6',
          200: '#B3CDEB',
          300: '#7FA9D9',
          400: '#4A80C2',
          500: '#255FA6',
          600: '#164A8A',
          700: '#103A6E',
          800: '#0C2D56',
          900: '#081F3D',
        },
        // Svijetla ledeno plava – pozadine i naglasci
        ice: {
          50: '#F7FBFE',
          100: '#EAF4FB',
          200: '#D3E8F6',
        },
        // Topli jantar – pozivi na akciju
        amber: {
          400: '#F7A93B',
          500: '#EE8E1A',
          600: '#D07410',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(8,31,61,.06), 0 8px 24px -12px rgba(8,31,61,.18)',
      },
    },
  },
  plugins: [],
};
