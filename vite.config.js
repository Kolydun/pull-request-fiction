import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const rootDir = import.meta.dirname;

// GitHub Pages serves this project under the /pull-request-fiction/ subpath,
// so every asset URL must be prefixed with `base`.
export default defineConfig({
  base: '/pull-request-fiction/',
  build: {
    rollupOptions: {
      input: {
        // Multi-page app: one entry per HTML page.
        // `favorites.html` is added in Task 6.
        main: resolve(rootDir, 'index.html'),
        favorites: resolve(rootDir, 'favorites.html'),
      },
    },
  },
});
