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
    modulePreload: {
      polyfill: false
    },
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        preserveModules: true,
        entryFileNames: '[name].js',
        preserveModulesRoot: 'src',
        inlineDynamicImports: false
      },
      treeshake: {
        moduleSideEffects: true,
        propertyReadSideEffects: true,
        unknownGlobalSideEffects: false
      }
    }
  },
  esbuild: {
    target: 'es2022',
    format: 'esm',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    keepNames: true,
    legalComments: 'none'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
  }
}); 