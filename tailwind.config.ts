import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-primary':
          'linear-gradient(90deg, #0f2b92 0%, #223c9b 62%, #f7e0ce 75%, #f89d58 87%, #ff611e 100%)',
      },
    },
  },
  plugins: [],
}
export default config
