import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// 库产物输出到 dist-lib，避免与文档站 dist 冲突
// 类型声明由 tsconfig.lib.json + tsc emitDeclarationOnly 生成（见 npm run build:lib）
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
