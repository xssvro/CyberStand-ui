import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib-entry.ts'),
      name: 'StandUI',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist-lib',
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'stand-ui[extname]',
      },
    },
  },
});
