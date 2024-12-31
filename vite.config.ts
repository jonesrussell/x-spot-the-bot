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
        entryFileNames: '[name].js',
        preserveModulesRoot: 'src'
      },
      treeshake: {
        moduleSideEffects: true,
        propertyReadSideEffects: true
      }
    },
    sourcemap: true,
    minify: false
  },
  esbuild: {
    keepNames: true,
    treeShaking: false,
    legalComments: 'inline',
    target: 'es2022'
  }
}); 