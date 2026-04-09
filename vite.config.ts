import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import prerender from 'vite-plugin-prerender';

export default defineConfig({
  plugins: [
    react(),
    prerender({
      staticDir: 'dist',
      routes: ['/'], // add more routes if needed
      renderAfterDocumentEvent: 'prerender-trigger',
    }),
  ],
});
