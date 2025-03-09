import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/api/generator/',
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  }
}); 