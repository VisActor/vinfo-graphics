import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'vinfo-graphics': resolve(__dirname, '../src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        screenshot: './screenshot.html',
      },
    },
  },
});
