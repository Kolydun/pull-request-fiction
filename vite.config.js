import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

const rootDir = import.meta.dirname;

// Pages live in src/, same as the GoIT vanilla template.
// GitHub Pages serves the site under /pull-request-fiction/.
export default defineConfig({
  root: resolve(rootDir, 'src'),
  base: '/pull-request-fiction/',
  plugins: [injectHTML()],
  build: {
    outDir: resolve(rootDir, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'src/index.html'),
        favorites: resolve(rootDir, 'src/favorites.html'),
      },
    },
  },
});
