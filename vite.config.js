import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // '/' za poslužitelj (podstranice trebaju apsolutne putanje); './' za samostalni pregled
  base: process.env.INLINE_ASSETS ? './' : '/',
  build: {
    // INLINE_ASSETS=1 ugrađuje pisma u CSS (samostalni HTML pregled bez poslužitelja)
    assetsInlineLimit: process.env.INLINE_ASSETS ? 10_000_000 : 4096,
  },
  ssr: { noExternal: ['lucide-react'] },
});
