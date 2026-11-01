import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

const currentDir = import.meta.dirname || resolve('.');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(currentDir, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
