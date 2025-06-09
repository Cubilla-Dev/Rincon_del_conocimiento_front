import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'preact'
  }
});