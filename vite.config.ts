import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'src/content/index.ts',
      formats: ['iife'],
      name: 'xbot'
    },
    modulePreload: false,
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      external: ['chrome'],
      output: {
        format: 'iife',
        name: 'xbot',
        extend: true,
        globals: {
          chrome: 'chrome'
        },
        generatedCode: {
          constBindings: true
        }
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  esbuild: {
    target: 'es2022',
    format: 'esm',
    platform: 'browser',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    keepNames: true,
    legalComments: 'none'
  }
}); 