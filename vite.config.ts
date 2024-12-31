import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/content/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        entryFileNames: '[name].js'
      }
    }
  },
  esbuild: {
    keepNames: true,
    treeShaking: true
  }
}); 