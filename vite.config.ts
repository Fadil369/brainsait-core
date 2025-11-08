import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const apiBase = env.VITE_API_BASE_URL || 'http://localhost:4000';
    const wsBase = env.VITE_WS_BASE_URL || apiBase.replace(/^http/i, 'ws');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: apiBase,
            changeOrigin: true,
          },
          '/ws': {
            target: wsBase,
            changeOrigin: true,
            ws: true,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.COPILOT_LOCALE': JSON.stringify(env.COPILOT_LOCALE || 'ar-SA'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
