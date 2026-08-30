import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/scratch へのアクセスを Scratch 公式 API に転送する設定
      '/api/scratch': {
        target: 'https://api.scratch.mit.edu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/scratch/, ''),
      },
    },
  },
});